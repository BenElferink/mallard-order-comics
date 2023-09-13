import type { PolicyId, TokenId } from '@/@types'
import formatHex from './formatHex'

const splitTokenId = (tokenId: TokenId, policyId: PolicyId) => {
  const ref = '000643b0'
  const nft = '000de140'

  const tokenLabel = tokenId.replace(policyId, '')
  const tokenType = tokenLabel.substring(0, 8)
  const tokenName = tokenLabel.substring(8)

  return {
    tokenType: tokenType === ref ? '100' : tokenType === nft ? '222' : '',
    tokenName: formatHex.fromHex(tokenName),
  }
}

export default splitTokenId
