import type { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from '@/utils/firebase'
import blockfrost from '@/utils/blockfrost'
import splitTokenId from '@/functions/splitTokenId'
import type { PolicyId, TokenId } from '@/@types'
import { ALLOWED_POLICIES } from '@/constants'

export interface PolicyPopulateResponse {
  policyId: PolicyId
  count: number
  tokens: TokenId[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse<PolicyPopulateResponse>) => {
  const { method, query } = req

  const policyId = query.policy_id?.toString()

  if (!policyId) return res.status(400).end()

  const isAllowedPolicy = ALLOWED_POLICIES.includes(policyId)

  if (!isAllowedPolicy) return res.status(400).end('Forbidden Policy')

  try {
    switch (method) {
      case 'GET': {
        console.log('Fetching tokens of Policy ID:', policyId)

        const fetchedTokens = await blockfrost.assetsPolicyByIdAll(policyId)

        console.log('Fetched tokens:', fetchedTokens.length)

        const tokenIds: TokenId[] = []

        for (const { asset: tokenId } of fetchedTokens) {
          const { tokenType } = splitTokenId(tokenId, policyId)
          if (tokenType === '222') tokenIds.push(tokenId)
        }

        const tokensCollection = firestore.collection('tokens')

        for await (const [idx, tokenId] of tokenIds.entries()) {
          console.log(idx, 'Handling DB data for Token ID:', tokenId)

          const getResult = await tokensCollection.doc(tokenId).get()
          if (!getResult.exists) await tokensCollection.doc(tokenId).set({ policyId, tokenId })
        }

        console.log('Done!')

        return res.status(200).json({
          policyId: policyId,
          count: tokenIds.length,
          tokens: tokenIds.sort((a, b) => Number(a?.substring(a.length - 8) || 0) - Number(b?.substring(a.length - 8) || 0)),
        })
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end()
      }
    }
  } catch (error: any) {
    console.error(error)

    if (['The requested component has not been found.', 'Invalid or malformed policy format.'].includes(error?.message)) {
      return res.status(400).end(`Policy not found: ${policyId}`)
    }

    return res.status(500).end()
  }
}

export default handler
