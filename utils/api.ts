import axios from 'axios'
import type { PopulatedToken } from '@/@types'
import type { PolicyResponse } from '@/pages/api/policy/[policy_id]'

class Api {
  baseUrl: string

  constructor() {
    this.baseUrl = '/api'
  }

  private handleError = async (error: any, reject: (reason: string) => void, retry: () => Promise<any>): Promise<any> => {
    console.error(error)

    if ([400, 404, 500, 504].includes(error?.response?.status)) {
      return reject(error?.response?.data || error?.message || 'UNKNOWN ERROR')
    } else {
      return await retry()
    }
  }

  policy = {
    getData: (policyId: string): Promise<PolicyResponse> => {
      const uri = `${this.baseUrl}/policy/${policyId}`

      return new Promise(async (resolve, reject) => {
        try {
          console.log('Fetching policy tokens:', policyId)

          const { data } = await axios.get<PolicyResponse>(uri)

          console.log('Fetched policy tokens:', data.tokens.length)

          return resolve(data)
        } catch (error: any) {
          return await this.handleError(error, reject, async () => await this.policy.getData(policyId))
        }
      })
    },
  }

  token = {
    getData: (tokenId: string): Promise<PopulatedToken> => {
      const uri = `${this.baseUrl}/token/${tokenId}`

      return new Promise(async (resolve, reject) => {
        try {
          console.log('Fetching token:', tokenId)

          const { data } = await axios.get<PopulatedToken>(uri)

          console.log('Fetched token:', data.fingerprint)

          return resolve(data)
        } catch (error: any) {
          return await this.handleError(error, reject, async () => await this.token.getData(tokenId))
        }
      })
    },
  }
}

const api = new Api()

export default api
