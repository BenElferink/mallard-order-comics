import type { CoverVariant } from '@/@types'

export const API_KEYS = {
  BLOCKFROST_API_KEY: process.env.BLOCKFROST_API_KEY || '',
  SATURN_API_KEY: process.env.SATURN_API_KEY || '',

  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
  FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
  FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
}

export const POLICY_IDS = {
  ADA_HANDLE: 'f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a',
  COMICS_ISSUE_ONE: '87c3a08adde0c1634e982ef6edce75dff2ac92aae34481070a59d9f2',
}

export const ALLOWED_POLICIES = [POLICY_IDS['COMICS_ISSUE_ONE']]

export const LINKS = {
  WEBSITE: 'https://mallardorder.io',
  X: 'https://x.com/mallardorder',
  DISCORD: 'https://discord.gg/mallardorder',
}

export const LOCAL_STORAGE_KEYS = {
  WALLET_PROVIDER: 'WALLET_PROVIDER',
}

export const COVER_VARIANTS = ['Common', 'Rare', 'Super Rare', 'Mythic'] as CoverVariant[]
