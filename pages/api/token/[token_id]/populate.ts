import type { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from '@/utils/firebase'
import populateToken from '@/functions/populateToken'
import comicsIssueOne from '@/data/87c3a08adde0c1634e982ef6edce75dff2ac92aae34481070a59d9f2.json'
import type { PopulatedToken } from '@/@types'

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
}

export interface TokenPopulateResponse extends PopulatedToken {}

const handler = async (req: NextApiRequest, res: NextApiResponse<TokenPopulateResponse>) => {
  const { method, query } = req

  const tokenId = query.token_id?.toString()

  if (!tokenId) return res.status(400).end()

  const isAllowedToken = !!comicsIssueOne.tokens.find((str) => str === tokenId)

  if (!isAllowedToken) return res.status(400).end('Forbidden Token')

  try {
    switch (method) {
      case 'GET': {
        const tokensCollection = firestore.collection('tokens')
        const populatedToken = await populateToken(tokenId)

        console.log('Handling DB data for Token ID:', tokenId)

        await tokensCollection.doc(tokenId).set(populatedToken)

        console.log('Done!')

        return res.status(200).json(populatedToken)
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end()
      }
    }
  } catch (error: any) {
    console.error(error)

    if (['The requested component has not been found.', 'Invalid or malformed asset format.'].includes(error?.message)) {
      return res.status(404).end(`Token not found: ${tokenId}`)
    }

    return res.status(500).end()
  }
}

export default handler
