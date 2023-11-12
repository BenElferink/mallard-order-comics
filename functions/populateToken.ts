import blockfrost from '@/utils/blockfrost'
import formatHex from './formatHex'
import type { Address, PopulatedToken, StakeKey, TokenId } from '@/@types'
import adaHandle from '@/utils/adaHandle'
import saturnNft from '@/utils/saturnNft'

const populateToken = async (tokenId: TokenId): Promise<PopulatedToken> => {
  try {
    console.log('Fetching token with Token ID:', tokenId)

    const {
      policy_id: policyId,
      fingerprint,
      asset_name,
      onchain_metadata_standard,
      onchain_metadata,
      metadata,
    } = await blockfrost.assetsById(tokenId)

    console.log('Fetched token:', fingerprint)

    const name = (onchain_metadata?.name?.toString() || formatHex.fromHex((asset_name || tokenId.replace(policyId, '')).substring(8)))
      .split('-')[1]
      .toUpperCase()
      .trim()

    const meta = onchain_metadata?.attributes || onchain_metadata || metadata || {}
    const attributes: Record<string, any> = {}

    Object.entries(meta).forEach(([key, val]) => {
      if (
        !['project', 'collection', 'name', 'description', 'logo', 'image', 'mediatype', 'files', 'decimals', 'ticker', 'url', 'website'].includes(
          key.toLowerCase()
        )
      ) {
        if (onchain_metadata_standard === 'CIP68v1') {
          attributes[key] = formatHex.fromHex(val?.toString() || 'X').slice(1)
        } else {
          attributes[key] = val?.toString()
        }
      }
    })

    const serialNumber = Number(name.match(/\d+/g)?.join('')) || 0
    const coverVariant = attributes['Cover Variant']
    const isClaimed = attributes['Physical Redemption'] === 'Claimed'

    console.log('Fetching addresses of Token ID:', tokenId)

    const assetAddresses = await blockfrost.assetsAddresses(tokenId, {
      count: 100,
      page: 1,
      order: 'asc',
    })

    console.log('Fetched addresses:', assetAddresses.length)

    const owners: {
      quantity: number
      stakeKey: StakeKey
      address: Address
    }[] = []

    for await (const { address, quantity } of assetAddresses) {
      console.log('Fetching wallet of address:', address)

      const wallet = await blockfrost.addresses(address)
      const stakeKey = wallet.stake_address || ''

      console.log('Fetched wallet:', stakeKey)

      owners.push({
        quantity: Number(quantity),
        stakeKey,
        address,
      })
    }

    const owner = owners[0].stakeKey || owners[0].address

    let ownerHandle = ''
    if (owner.indexOf('stake1') === 0) ownerHandle = await adaHandle.resolveWalletHandle(owner)

    let level: number

    try {
      level = await saturnNft.getLevel(serialNumber)
    } catch (error: any) {
      console.error(error?.message || error?.toString())
      level = 0
    }

    const payload: PopulatedToken = {
      policyId,
      tokenId,
      fingerprint,

      name,
      owner,
      ownerHandle,

      serialNumber,
      level,
      coverVariant,
      isClaimed,
    }

    return payload
  } catch (error: any) {
    console.error(error)
    console.error('Error populating Token with ID:', tokenId)

    return await populateToken(tokenId)
  }
}

export default populateToken
