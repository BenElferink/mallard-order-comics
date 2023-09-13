import blockfrost from '@/utils/blockfrost'
import formatHex from './formatHex'
import formatIpfsReference from './formatIpfsReference'
import type { Address, PopulatedToken, StakeKey, TokenId } from '@/@types'

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

    const name = onchain_metadata?.name?.toString() || formatHex.fromHex((asset_name || tokenId.replace(policyId, '')).substring(8))
    const thumb = formatIpfsReference(
      onchain_metadata?.image
        ? Array.isArray(onchain_metadata.image)
          ? onchain_metadata.image.join('')
          : onchain_metadata.image.toString()
        : ''.replaceAll(',', '')
    ).ipfs

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

    let points = 0

    ;[
      {
        value: 'Common',
        points: 1,
      },
      {
        value: 'Rare',
        points: 10,
      },
      {
        value: 'Super Rare',
        points: 20,
      },
      {
        value: 'Mythic',
        points: 2000,
      },
    ].forEach((item) => {
      if (coverVariant === item.value) points += item.points
    })
    ;[
      {
        minValue: 1,
        maxValue: 1,
        points: 500,
      },
      {
        minValue: 2,
        maxValue: 5,
        points: 100,
      },
      {
        minValue: 6,
        maxValue: 10,
        points: 50,
      },
      {
        minValue: 11,
        maxValue: 100,
        points: 25,
      },
    ].forEach((item) => {
      if (serialNumber >= item.minValue && serialNumber <= item.maxValue) points += item.points
    })

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

    const payload: PopulatedToken = {
      policyId,
      tokenId,
      fingerprint,

      name,
      thumb,
      owner,

      serialNumber,
      coverVariant,
      isClaimed,
      points,
    }

    return payload
  } catch (error: any) {
    console.error(error)
    console.error('Error populating Token with ID:', tokenId)

    return await populateToken(tokenId)
  }
}

export default populateToken
