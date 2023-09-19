import axios from 'axios'
import getSerialStringFromSerialNumber from '@/functions/getSerialStringFromSerialNumber'
import { API_KEYS } from '@/constants'

class SaturnNft {
  baseUrl: string

  constructor() {
    this.baseUrl = 'https://api.saturnnft.io/graphql'
  }

  getLevel = (serialNumber: number): Promise<number> => {
    const uri = this.baseUrl
    const comicIssueOneProjectId = '9267b11c-dcb8-4298-8365-efdf29bc0d4e'

    return new Promise(async (resolve, reject) => {
      try {
        console.log('Fetching level from Saturn:', serialNumber)

        const { data } = await axios.post<{
          data: {
            publicNFTs: {
              edges: {
                node: {
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
              '\n query PublicNFTs($input: GetPublicNFTsInput!, $where: NFTFilterInput) {\n publicNFTs(input: $input, where: $where ) {\n edges {\n node {\n collection_id\n nft_data {\n name\n max_level\n }\n }\n }\n totalCount\n }\n }\n ',
            variables: {
              input: {
                nftProjectId: comicIssueOneProjectId,
              },
              where: {
                asset_name: { eq: `TMO Comics - Issue One ${getSerialStringFromSerialNumber(serialNumber)}` },
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
