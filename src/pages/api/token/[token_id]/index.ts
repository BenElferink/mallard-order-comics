import type { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from '@/utils/firebase'
import type { PopulatedToken } from '@/@types'

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
}

export interface TokenResponse extends PopulatedToken {}

const handler = async (req: NextApiRequest, res: NextApiResponse<TokenResponse>) => {
  const { method, query } = req

  const tokenId = query.token_id?.toString()

  if (!tokenId) return res.status(400).end()

  try {
    switch (method) {
      case 'GET': {
        const tokensCollection = firestore.collection('tokens')
        const getResult = await tokensCollection.doc(tokenId).get()

        if (!getResult.exists) return res.status(404).end('Token not found')

        const payload = getResult.data() as PopulatedToken

        return res.status(200).json(payload)
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
