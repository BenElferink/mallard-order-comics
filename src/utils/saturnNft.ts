import axios from 'axios'
import { API_KEYS } from '@/constants'
import { PolicyId } from '@/@types'

class SaturnNft {
  baseUrl: string
  projectId: string

  constructor() {
    this.baseUrl = 'https://api.saturnnft.io/graphql'
    this.projectId = '9267b11c-dcb8-4298-8365-efdf29bc0d4e'
  }

  getProject = (
    policyId: PolicyId
  ): Promise<{
    projectId: string
    accountId: string
    plutusScriptId: string
  }> =>
    new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching project from Saturn:', policyId)

        const { data } = await axios.post<{
          data: {
            publicNFTProjects: {
              nodes: {
                id: string
                account_id: string
                plutus_script_id: string
              }[]
            }
          }
        }>(
          this.baseUrl,
          {
            query:
              'query PublicNFTProjects($where: NFTProjectFilterInput) { publicNFTProjects(where: $where) { nodes { id account_id plutus_script_id } } }',
            variables: {
              where: {
                policy_id: { eq: policyId },
              },
            },
            operationName: 'PublicNFTProjects',
          },
          {
            headers: {
              'Accept-Encoding': 'application/json',
              Authorization: `Bearer ${API_KEYS['SATURN_API_KEY']}`,
            },
          }
        )

        const payload = data.data.publicNFTProjects.nodes.map((item) => ({
          projectId: item.id,
          accountId: item.account_id,
          plutusScriptId: item.plutus_script_id,
        }))[0]

        console.log('Fetched project from Saturn:', payload)

        return resolve(payload)
      } catch (error: any) {
        return reject(error)
      }
    })

  getLevel = (serialNumber: number): Promise<number> => {
    const uri = this.baseUrl

    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching level from Saturn:', serialNumber)

        const { data } = await axios.post<{
          data: {
            publicNFTs: {
              edges: {
                node: {
                  id: string
                  collection_id: number
                  nft_data: {
                    name: string
                    max_level: number
                  }
                }
              }[]
              totalCount: number
            }
          }
        }>(
          uri,
          {
            query:
              'query PublicNFTs($input: GetPublicNFTsInput!, $where: NFTFilterInput) { publicNFTs(input: $input, where: $where ) { edges { node { id collection_id nft_data { max_level } upgrade_nfts { id upgrade_level { id level } } } } } }',
            variables: {
              input: {
                nftProjectId: this.projectId,
              },
              where: {
                collection_id: { eq: serialNumber },
              },
            },
            operationName: 'PublicNFTs',
          },
          {
            headers: {
              'Accept-Encoding': 'application/json',
              Authorization: `Bearer ${API_KEYS['SATURN_API_KEY']}`,
            },
          }
        )

        const level = data?.data?.publicNFTs?.edges[0]?.node.nft_data?.max_level || 0

        console.log('Fetched level from Saturn:', level)

        return resolve(level)
      } catch (error: any) {
        return reject(error)
      }
    })
  }
}

const saturnNft = new SaturnNft()

export default saturnNft
