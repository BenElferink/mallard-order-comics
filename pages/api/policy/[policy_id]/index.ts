import type { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from '@/utils/firebase'
import type { PolicyId, PopulatedToken } from '@/@types'

export const config = {
  api: {
    responseLimit: false,
  },
}

export interface PolicyResponse {
  policyId: PolicyId
  count: number
  tokens: Partial<PopulatedToken>[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse<PolicyResponse>) => {
  const { method, query } = req

  const policyId = query.policy_id?.toString()

  if (!policyId) return res.status(400).end()

  try {
    switch (method) {
      case 'GET': {
        const tokensCollection = firestore.collection('tokens')
        const getResult = await tokensCollection.where('policyId', '==', policyId).get()
        const payload = getResult.docs.map((doc) => doc.data() as Partial<PopulatedToken>)

        return res.status(200).json({
          policyId,
          count: payload.length,
          tokens: payload,
        })
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end()
      }
    }
  } catch (error: any) {
    console.error(error)
    return res.status(500).end()
  }
}

export default handler
