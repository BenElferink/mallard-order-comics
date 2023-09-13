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
  thumb: string
  owner: StakeKey | Address

  serialNumber: number
  coverVariant: CoverVariant
  isClaimed: boolean
  points: number
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
  points: number
  tokens: PopulatedToken[]
}
