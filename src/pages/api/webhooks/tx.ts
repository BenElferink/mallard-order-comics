import type { NextApiRequest, NextApiResponse } from 'next'
import { firestore } from '@/utils/firebase'
import resolveUtxos from '@/functions/resolveUtxos'
import populateToken from '@/functions/populateToken'
import type { TokenId } from '@/@types'

export const config = {
  maxDuration: 300,
  api: {
    responseLimit: false,
  },
}

interface BlockfrostBody {
  id: string
  webhook_id: string
  created: number
  api_version: number
  type: 'transaction'
  payload: {
    tx: {
      hash: string
      block: string
      block_height: number
      block_time: number
      slot: number
      index: number
      output_amount: { unit: string; quantity: string }[]
      fees: string
      deposit: string
      size: number
      invalid_before: string
      invalid_hereafter: string
      utxo_count: number
      withdrawal_count: number
      mir_cert_count: number
      delegation_count: number
      stake_cert_count: number
      pool_update_count: number
      pool_retire_count: number
      asset_mint_or_burn_count: number
      redeemer_count: number
      valid_contract: boolean
    }
    inputs: {
      address: string
      amount: { unit: string; quantity: string }[]
      tx_hash: string
      output_index: number
      data_hash: string | null
      inline_datum: string | null
      reference_script_hash: string | null
      collateral: boolean
      reference: boolean
    }[]
    outputs: {
      address: string
      amount: { unit: string; quantity: string }[]
      tx_hash: string
      output_index: number
      data_hash: string | null
      inline_datum: string | null
      reference_script_hash: string | null
      collateral: boolean
      reference: boolean
    }[]
  }[]
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method, body } = req

  try {
    switch (method) {
      case 'POST': {
        const tokensCollection = firestore.collection('tokens')

        for await (const payload of (body as BlockfrostBody).payload) {
          const utxos = await resolveUtxos(payload.tx.hash, payload)
          const tokenIds: TokenId[] = []

          utxos.forEach(({ tokens }) => {
            tokens.forEach(({ tokenId }) => {
              if (!tokenIds.includes(tokenId)) tokenIds.push(tokenId)
            })
          })

          for await (const tokenId of tokenIds) {
            const populatedToken = await populateToken(tokenId)

            console.log('Handling DB data for Token ID:', tokenId)

            await tokensCollection.doc(tokenId).set(populatedToken)
          }
        }

        console.log('Done!')

        return res.status(204).end()
      }

      default: {
        res.setHeader('Allow', 'POST')
        return res.status(405).end()
      }
    }
  } catch (error: any) {
    console.error(error)
    return res.status(500).end()
  }
}

export default handler
