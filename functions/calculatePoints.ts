import type { Address, PopulatedToken, StakeKey } from '@/@types'

const calculatePoints = (tokens: PopulatedToken[], stakeKey?: StakeKey) => {
  const leaderboard: Record<StakeKey | Address, number> = {}

  tokens.forEach((token) => {
    const id = token.owner

    if (!stakeKey || (!!stakeKey && stakeKey === id)) {
      leaderboard[id] = (leaderboard[id] || 0) + token.points
    }
  })

  return leaderboard
}

export default calculatePoints
