import blockfrost from '@/utils/blockfrost'
import type { Address, TokenId, TransactionId, Utxo } from '@/@types'
import { ALLOWED_POLICIES } from '@/constants'

interface InputOutput {
  address: Address
  amount: {
    unit: TokenId
    quantity: string
  }[]
}

const resolveUtxos = async (
  transactionId: TransactionId,
  inputsOutputs?: {
    inputs: InputOutput[]
    outputs: InputOutput[]
  }
) => {
  const txUtxos: {
    inputs: InputOutput[]
    outputs: InputOutput[]
  } = {
    inputs: [],
    outputs: [],
  }

  if (!!inputsOutputs) {
    txUtxos.inputs = inputsOutputs.inputs
    txUtxos.outputs = inputsOutputs.outputs
  } else {
    console.log('Fetching UTXOs of Transaction ID:', transactionId)

    const result = await blockfrost.txsUtxos(transactionId)
    txUtxos.inputs = result.inputs
    txUtxos.outputs = result.outputs

    console.log('Fetched UTXOs')
  }

  const utxos: Utxo[] = []

  for (const input of txUtxos.inputs) {
    const fromAddress = input.address

    for (const output of txUtxos.outputs) {
      const toAddress = output.address

      if (toAddress !== fromAddress) {
        const tokens: Utxo['tokens'] = []

        output.amount.forEach(({ unit: tokenId, quantity }) => {
          const tokenAmount = Number(quantity)

          if (
            tokenAmount &&
            ALLOWED_POLICIES.some((policyId) => tokenId.indexOf(policyId) === 0) &&
            !!input.amount.find((inp) => inp.unit === tokenId)
          ) {
            tokens.push({
              tokenId,
              tokenAmount,
            })
          }
        })

        if (tokens.length) {
          utxos.push({
            address: {
              from: fromAddress,
              to: toAddress,
            },
            tokens,
          })
        }
      }
    }
  }

  return utxos
}

export default resolveUtxos
