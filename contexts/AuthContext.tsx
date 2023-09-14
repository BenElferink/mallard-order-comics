import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useWallet } from '@meshsdk/react'
import api from '@/utils/api'
import calculatePoints from '@/functions/calculatePoints'
import type { PopulatedWallet } from '@/@types'
import { POLICY_IDS } from '@/constants'

interface AuthContext {
  populatingWallet: boolean
  populatedWallet: PopulatedWallet | null
  openConnectModal: boolean
  toggleConnectModal: (bool?: boolean) => void
}

const initContext: AuthContext = {
  populatingWallet: false,
  populatedWallet: null,
  openConnectModal: false,
  toggleConnectModal: () => {},
}

const AuthContext = createContext(initContext)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = (props: PropsWithChildren) => {
  const { children } = props
  const { connecting, connected, name, wallet, disconnect } = useWallet()

  const [openConnectModal, setOpenConnectModal] = useState(false)
  const toggleConnectModal = (bool?: boolean) => setOpenConnectModal((prev) => bool ?? !prev)

  const [populatingWallet, setPopulatingWallet] = useState(false)
  const [populatedWallet, setPopulatedWallet] = useState<PopulatedWallet | null>(null)

  const populate = useCallback(async (): Promise<void> => {
    try {
      setPopulatingWallet(true)
      toast.dismiss()
      toast.loading('Loading Profile')

      const stakeKey = (await wallet.getRewardAddresses())[0]
      const assets = await wallet.getPolicyIdAssets(POLICY_IDS['COMICS_ISSUE_ONE'])
      const populatedTokens = await Promise.all(assets.map(({ unit }) => api.token.getData(unit)) || [])
      const points = calculatePoints(populatedTokens, stakeKey)[stakeKey]

      setPopulatedWallet({
        stakeKey,
        points,
        tokens: populatedTokens,
      })

      toast.dismiss()
      toast.success('Profile Loaded')
    } catch (error: any) {
      setPopulatedWallet(null)
      disconnect()

      toast.dismiss()
      toast.error(error.message || error.toString())
    } finally {
      setPopulatingWallet(false)
    }
  }, [wallet, disconnect])

  useEffect(() => {
    if (connecting) {
      toast.dismiss()
      toast.loading('Connecting Wallet')
    }

    if (connected) {
      toast.dismiss()
      toast.success(`Connected ${name}`)

      populate()
    } else {
      setPopulatedWallet(null)
    }
  }, [connecting, connected, name, populate])

  return (
    <AuthContext.Provider
      value={{
        populatingWallet,
        populatedWallet,
        openConnectModal,
        toggleConnectModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
