import type { NextApiRequest, NextApiResponse } from 'next'
import Api from '@/utils/api'
import blockfrost from '@/utils/blockfrost'
import adaHandle from '@/utils/adaHandle'
import populateLeaderboard from '@/functions/populateLeaderboard'
import type { PopulatedWallet } from '@/@types'
import { POLICY_IDS } from '@/constants'

export const config = {
  api: {
    responseLimit: false,
  },
}

export interface WalletResponse extends PopulatedWallet {}

const handler = async (req: NextApiRequest, res: NextApiResponse<WalletResponse>) => {
  const { method, query } = req

  const walletId = query.wallet_id?.toString() as string
  const stakeKey = walletId.indexOf('stake1') === 0 ? walletId : ''

  if (!stakeKey) {
    return res.status(400).end('Please provide a valid wallet identifer: stake1...')
  }

  try {
    switch (method) {
      case 'GET': {
        console.log('Fetching tokens of wallet:', stakeKey)

        const fetchedTokens = (await blockfrost.accountsAddressesAssetsAll(stakeKey)).filter(
          ({ unit }) => unit.indexOf(POLICY_IDS['COMICS_ISSUE_ONE']) === 0
        )

        console.log('Fetched tokens:', fetchedTokens.length)

        const api = new Api('http://localhost:3000')
        const populatedTokens = await Promise.all(fetchedTokens.map(({ unit }) => api.token.getData(unit)) || [])

        const wallet: PopulatedWallet = {
          stakeKey,
          handle: await adaHandle.resolveWalletHandle(stakeKey),
          points: populateLeaderboard(populatedTokens, stakeKey)[0]?.points || 0,
          tokens: populatedTokens,
        }

        return res.status(200).json(wallet)
      }

      default: {
        res.setHeader('Allow', 'GET')
        return res.status(405).end()
      }
    }
  } catch (error: any) {
    console.error(error)

    if (
      [
        'The requested component has not been found.',
        'Invalid address for this network or malformed address format.',
        'Invalid or malformed stake address format.',
      ].includes(error?.message)
    ) {
      return res.status(404).end(`Wallet not found: ${walletId}`)
    }

    return res.status(500).end()
  }
}

export default handler
