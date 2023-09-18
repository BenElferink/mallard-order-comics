import type { Address, PopulatedToken, StakeKey } from '@/@types'
import getTokenSerialNumberPoints from './getTokenSerialNumberPoints'

const populateLeaderboard = (tokens: PopulatedToken[], stakeKey?: StakeKey) => {
  const whoOwnsWhat: Record<StakeKey | Address, PopulatedToken[]> = {}
  const leaderboard: Record<StakeKey | Address, number> = {}
  const handles: Record<StakeKey | Address, string> = {}

  tokens.forEach((token) => {
    const walletId = token.owner

    if (!stakeKey || (!!stakeKey && stakeKey === walletId)) {
      if (whoOwnsWhat[walletId]) {
        whoOwnsWhat[walletId].push(token)
      } else {
        whoOwnsWhat[walletId] = [token]
      }
    }
  })

  Object.entries(whoOwnsWhat).forEach(([walletId, tokens]) => {
    const handle = tokens.find((token) => !!token.ownerHandle)?.ownerHandle || ''
    if (handle) handles[walletId] = handle

    let points = 0,
      mythicCount = tokens.reduce((prev, { coverVariant }) => (coverVariant === 'Mythic' ? prev + 1 : prev), 0),
      superRareCount = tokens.reduce((prev, { coverVariant }) => (coverVariant === 'Super Rare' ? prev + 1 : prev), 0),
      rareCount = tokens.reduce((prev, { coverVariant }) => (coverVariant === 'Rare' ? prev + 1 : prev), 0),
      commonCount = tokens.reduce((prev, { coverVariant }) => (coverVariant === 'Common' ? prev + 1 : prev), 0)

    while (mythicCount && superRareCount && rareCount && commonCount) {
      points += 2031
      mythicCount--
      superRareCount--
      rareCount--
      commonCount--
    }

    while (superRareCount && rareCount && commonCount) {
      points += 31
      superRareCount--
      rareCount--
      commonCount--
    }

    while (rareCount && commonCount) {
      points += 11
      rareCount--
      commonCount--
    }

    while (commonCount) {
      points += 1
      commonCount--
    }

    // any remaining non-sets
    while (mythicCount || superRareCount || rareCount || commonCount) {
      points += mythicCount + superRareCount + rareCount + commonCount
      mythicCount = 0
      superRareCount = 0
      rareCount = 0
      commonCount = 0
    }

    tokens.forEach(({ serialNumber }) => {
      points += getTokenSerialNumberPoints(serialNumber)
    })

    leaderboard[walletId] = (leaderboard[walletId] || 0) + points
  })

  return Object.entries(leaderboard)
    .map(([walletId, points]) => ({
      walletId,
      handle: handles[walletId] || '',
      points,
    }))
    .sort((a, b) => b.points - a.points)
}

export default populateLeaderboard
