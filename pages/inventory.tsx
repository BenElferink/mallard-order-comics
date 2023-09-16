import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import formatIpfsReference from '@/functions/formatIpfsReference'
import Auth from '@/components/Auth'
import Loader from '@/components/Loader'
import getTokenSerialNumberPoints from '@/functions/getTokenSerialNumberPoints'

const Page = () => {
  const { populatingWallet, populatedWallet } = useAuth()

  return (
    <main className='min-h-screen flex flex-col items-center'>
      <h2 className='text-2xl'>MY INVENTORY</h2>

      {!populatedWallet?.stakeKey ? (
        populatingWallet ? (
          <Loader />
        ) : (
          <Auth />
        )
      ) : (
        <div className='max-w-[1100px] flex flex-col items-center'>
          <div>
            TOTAL COLLECTOR'S POINTS: <span>{populatedWallet.points} POINTS</span>
          </div>

          <div className='flex flex-wrap justify-center'>
            {populatedWallet.tokens.map((token) => {
              const serialPoints = getTokenSerialNumberPoints(token.serialNumber)

              return (
                <div key={token.tokenId} className='p-4 flex flex-col items-center text-center'>
                  <Image
                    src={formatIpfsReference(token.thumb).url}
                    alt=''
                    width={0}
                    height={0}
                    priority
                    unoptimized
                    className='w-[140px] h-[210px] object-cover rounded-lg'
                  />
                  <h5>{token.name.split('-')[1].toUpperCase().trim()}</h5>
                  <h6 className='text-sm'>{serialPoints ? `${serialPoints} POINTS` : ''}</h6>
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
