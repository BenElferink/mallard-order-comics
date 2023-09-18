import Image from 'next/image'
import { Antonio, Imbue } from 'next/font/google'
import { useAuth } from '@/contexts/AuthContext'
import getTokenSerialNumberPoints from '@/functions/getTokenSerialNumberPoints'
import Auth from '@/components/Auth'
import Loader from '@/components/Loader'

const imbue = Imbue({ weight: '300', subsets: ['latin'] })
const antonio = Antonio({ weight: '300', subsets: ['latin'] })

const Page = () => {
  const { populatingWallet, populatedWallet } = useAuth()

  return (
    <main className='min-h-screen px-12 flex flex-col items-center'>
      <h2 className={`text-center text-4xl sm:text-6xl font-normal ${imbue.className}`}>MY INVENTORY</h2>

      {!populatedWallet?.stakeKey ? (
        <div className='mt-8'>{populatingWallet ? <Loader /> : <Auth />}</div>
      ) : (
        <div className='w-full flex flex-col items-center'>
          <div className={`w-full my-4 p-8 flex items-center justify-center rounded-lg bg-red-950/80 text-xl sm:text-3xl ${antonio.className}`}>
            TOTAL COLLECTOR&apos;S POINTS:{' '}
            <span className='w-2/5 p-4 ml-8 text-center rounded-lg border border-red-800 bg-red-950'>{populatedWallet.points} POINTS</span>
          </div>

          <div className='w-full mb-12 max-h-[150vh] overflow-y-scroll p-8 flex flex-wrap justify-center rounded-lg bg-neutral-900/50'>
            {populatedWallet.tokens.map((token) => {
              const displayName = token.name.split('-')[1].toUpperCase().trim()
              const coverRarity = token.coverVariant.toLowerCase().replaceAll(' ', '_')
              const serialPoints = getTokenSerialNumberPoints(token.serialNumber)

              return (
                <div key={token.tokenId} className={`m-6 flex flex-col items-center text-center ${antonio.className}`}>
                  <Image
                    src={`/media/cover_varients/${coverRarity}.jpeg`}
                    alt={coverRarity}
                    width={150}
                    height={170}
                    className='border border-teal-900'
                    priority
                    unoptimized
                  />
                  <h5 className='mt-2'>{displayName}</h5>
                  <h6 className='mt-1 text-sm text-sky-500'>{serialPoints ? `${serialPoints} POINTS` : ''}</h6>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </main>
  )
}

export default Page
