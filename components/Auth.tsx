import Image from 'next/image'
import { Fragment, useEffect, useRef } from 'react'
import { toast } from 'react-hot-toast'
import { StarIcon, WalletIcon } from '@heroicons/react/24/solid'
import { useWallet, useWalletList } from '@meshsdk/react'
import { useAuth } from '@/contexts/AuthContext'
import truncateStringInMiddle from '@/functions/truncateStringInMiddle'
import Modal from './Modal'
import { LS_KEYS } from '@/constants'

const Auth = () => {
  const installedWallets = useWalletList()
  const { connect, disconnect, connecting, connected, name, error } = useWallet()
  const { populatingWallet, populatedWallet, openConnectModal, toggleConnectModal } = useAuth()

  const mountRef = useRef(false)

  useEffect(() => {
    if (!mountRef.current) {
      mountRef.current = true

      const lsValue = localStorage.getItem(LS_KEYS['WALLET_PROVIDER'])
      if (lsValue) connect(lsValue)
    } else {
      if (connected) {
        localStorage.setItem(LS_KEYS['WALLET_PROVIDER'], name)
        toggleConnectModal(false)
      } else {
        localStorage.removeItem(LS_KEYS['WALLET_PROVIDER'])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, name])

  return (
    <Fragment>
      <div className='flex flex-col'>
        <button
          type='button'
          disabled={openConnectModal}
          onClick={() => toggleConnectModal(true)}
          className='min-w-[200px] m-1 p-2 flex items-center justify-center rounded-lg border border-transparent hover:border-neutral-50 focus:border-neutral-50 bg-gradient-to-b from-sky-700 via-sky-950 to-sky-700 disabled:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {connected ? (
            <Image
              src={installedWallets.find((item) => item.name === name)?.icon || ''}
              alt={name}
              width={35}
              height={35}
              className='w-6 h-6 mr-2 drop-shadow-[0_0_1px_rgba(0,0,0,1)]'
              priority
              unoptimized
            />
          ) : (
            <WalletIcon className='w-6 h-6 mr-2' />
          )}

          {connected && !!populatedWallet
            ? truncateStringInMiddle(populatedWallet.stakeKey, 8)
            : connecting || populatingWallet
            ? 'Connecting'
            : 'Connect'}
        </button>

        {connected && !!populatedWallet ? (
          <div className='min-w-[200px] m-1 p-2 flex items-center justify-center rounded-lg border border-transparent bg-red-800'>
            <StarIcon className='w-6 h-6 mr-2' />
            <span>Collector&apos;s Points: {populatedWallet.points}</span>
          </div>
        ) : null}
      </div>

      <Modal open={openConnectModal} onClose={() => toggleConnectModal(false)}>
        {!installedWallets.length ? (
          <p className='mt-[50%]'>No wallets installed...</p>
        ) : (
          <div className='max-w-[555px] px-8 mx-auto text-center'>
            <h2 className='text-lg'>Connect Wallet</h2>

            {/* @ts-ignore */}
            {error ? <p className='text-red-400'>{error?.message || error?.toString()}</p> : null}

            {installedWallets.map((item) => (
              <button
                key={item.name}
                onClick={() => connect(item.name)}
                disabled={connected || connecting}
                className='w-full my-2 p-4 flex items-center justify-between rounded-lg border border-transparent hover:border-zinc-400 focus:border-zinc-400 disabled:border-transparent bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed'
              >
                <Image src={item.icon} alt='' width={35} height={35} className='drop-shadow-[0_0_1px_rgba(0,0,0,1)]' priority unoptimized />
                {item.name}
              </button>
            ))}

            {connected ? (
              <button
                type='button'
                disabled={!connected || connecting}
                onClick={() => {
                  disconnect()
                  toast.success('Disconnected')
                }}
                className='w-full my-2 p-4 flex items-center justify-center rounded-lg border border-transparent hover:border-zinc-400 focus:border-zinc-400 disabled:border-transparent bg-zinc-700 hover:bg-zinc-600 disabled:opacity-30 disabled:cursor-not-allowed'
              >
                Disconnect
              </button>
            ) : null}
          </div>
        )}
      </Modal>
    </Fragment>
  )
}

export default Auth
