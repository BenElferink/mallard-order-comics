import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { useWallet } from '@meshsdk/react'
import Api from '@/utils/api'
import type { PopulatedToken, PopulatedWallet } from '@/@types'
import { POLICY_IDS } from '@/constants'

interface DataContext {
  openConnectModal: boolean
  toggleConnectModal: (bool?: boolean) => void
  populatingWallet: boolean
  populatedWallet: PopulatedWallet | null
  populatingTokens: boolean
  populatedTokens: PopulatedToken[]
}

const initContext: DataContext = {
  openConnectModal: false,
  toggleConnectModal: () => {},
  populatingWallet: false,
  populatedWallet: null,
  populatingTokens: false,
  populatedTokens: [],
}

const api = new Api()
const DataContext = createContext(initContext)

export const useData = () => useContext(DataContext)

export const DataProvider = (props: PropsWithChildren) => {
  const { children } = props
  const { connected, name, wallet, disconnect } = useWallet()

  const [openConnectModal, setOpenConnectModal] = useState(false)
  const toggleConnectModal = (bool?: boolean) => setOpenConnectModal((prev) => bool ?? !prev)

  const [populatingWallet, setPopulatingWallet] = useState(false)
  const [populatedWallet, setPopulatedWallet] = useState<PopulatedWallet | null>(null)

  const populate = useCallback(async (): Promise<void> => {
    try {
      setPopulatingWallet(true)

      const stakeKey = (await wallet.getRewardAddresses())[0]
      const { handle, points, tokens } = await api.wallet.getData(stakeKey)

      setPopulatedWallet({
        stakeKey,
        handle,
        points,
        tokens,
      })
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
    if (connected) {
      toast.dismiss()
      toast.loading('CONNECTING WALLET')

      populate().then(() => {
        const walletName = name?.toUpperCase().replace('WALLET', '').trim()

        toast.dismiss()
        toast.success(`${walletName} CONNECTED`)
      })
    } else {
      setPopulatedWallet(null)
    }
  }, [connected, populate, name])

  const [populatingTokens, setPopulatingTokens] = useState(false)
  const [populatedTokens, setPopulatedTokens] = useState<PopulatedToken[]>([])

  useEffect(() => {
    setPopulatingTokens(true)

    api.policy
      .getData(POLICY_IDS['COMICS_ISSUE_ONE'])
      .then(({ tokens }) => setPopulatedTokens(tokens as PopulatedToken[]))
      .catch((error) => console.error(error))
      .finally(() => setPopulatingTokens(false))
  }, [])

  return (
    <DataContext.Provider
      value={{
        openConnectModal,
        toggleConnectModal,
        populatingWallet,
        populatedWallet,
        populatingTokens,
        populatedTokens,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
