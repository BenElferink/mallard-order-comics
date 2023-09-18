export type StakeKey = string
export type Address = string

export type PolicyId = string
export type TokenId = string
export type TransactionId = string

export type CoverVariant = 'Common' | 'Rare' | 'Super Rare' | 'Mythic'

export interface PopulatedToken {
  policyId: PolicyId
  tokenId: TokenId
  fingerprint: string

  name: string
  owner: StakeKey | Address
  ownerHandle: string

  serialNumber: number
  level: number
  coverVariant: CoverVariant
  isClaimed: boolean
}

export interface Utxo {
  address: {
    from: Address
    to: Address
  }
  tokens: {
    tokenId: TokenId
    tokenAmount: number
  }[]
}

export interface PopulatedWallet {
  stakeKey: StakeKey
  handle: string
  points: number
  tokens: PopulatedToken[]
}
