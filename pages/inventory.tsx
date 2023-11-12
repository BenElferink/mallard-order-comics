import Link from 'next/link'
import Image from 'next/image'
import { Antonio, Imbue } from 'next/font/google'
import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import getSerialStringFromSerialNumber from '@/functions/getSerialStringFromSerialNumber'
import Auth from '@/components/Auth'
import Modal from '@/components/Modal'
import Loader from '@/components/Loader'
import UpgradeIcon from '@/icons/Upgrade'

const antonio = Antonio({ weight: '300', subsets: ['latin'] })
const imbue = Imbue({ weight: '300', subsets: ['latin'] })

const Page = () => {
  const { populatingWallet, populatedWallet } = useData()
  const [openReader, setOpenReader] = useState(false)

  const toggleReader = () => setOpenReader((prev) => !prev)

  if (!populatedWallet?.stakeKey) {
    return (
      <main className='min-h-screen flex items-start justify-center'>
        <div>{populatingWallet ? <Loader /> : <Auth />}</div>
      </main>
    )
  }

  return (
    <main className={`min-h-screen mb-12 px-12 flex flex-col items-center ${antonio.className}`}>
      <div className='w-full p-8 mb-12 flex items-center justify-center rounded-lg bg-red-950/80 text-xl sm:text-3xl'>
        TOTAL COLLECTOR&apos;S POINTS:{' '}
        <span className='w-2/5 p-4 ml-8 text-center rounded-lg border border-red-800 bg-red-950'>{populatedWallet.points} POINTS</span>
      </div>

      <h2 className={`mb-4 text-center text-4xl sm:text-6xl ${imbue.className}`}>MY INVENTORY</h2>

      <table className='w-full border-separate border-spacing-0 border border-sky-500 rounded-lg bg-black/60'>
        <thead className={`border-b-2 border-b-sky-500 ${antonio.className}`}>
          <tr>
            <th className='py-4 border-b-2 border-b-sky-500 text-center text-2xl'>ISSUE #</th>
            <th className='py-4 border-b-2 border-b-sky-500 text-center text-2xl'>STATS</th>
            <th className='py-4 border-b-2 border-b-sky-500 text-center text-2xl flex items-center justify-center'>
              UPGRADE <UpgradeIcon className='w-4 ml-2' />
            </th>
            <th className='py-4 border-b-2 border-b-sky-500 text-center text-2xl'>REDEMPTION</th>
            <th className='py-4 border-b-2 border-b-sky-500 text-center text-2xl'>READ</th>
          </tr>
        </thead>

        <tbody>
          {populatedWallet.tokens.map(({ tokenId, serialNumber, coverVariant, isClaimed, level }, idx) => {
            return (
              <tr key={tokenId}>
                <td className={idx === populatedWallet.tokens.length - 1 ? '' : 'border-b-2 border-b-sky-500'}>
                  <div className='py-8 px-4 flex flex-wrap items-center justify-center'>
                    <Image
                      src={`/media/cover_varients/${coverVariant.toLowerCase().replaceAll(' ', '_')}.webp`}
                      alt={coverVariant}
                      width={100}
                      height={160}
                      className='border border-amber-500'
                      priority
                      unoptimized
                    />
                    <span className='m-4 text-2xl'>{getSerialStringFromSerialNumber(serialNumber)}</span>
                  </div>
                </td>

                <td className={idx === populatedWallet.tokens.length - 1 ? '' : 'border-b-2 border-b-sky-500'}>
                  <div className='py-8 px-4 flex flex-col justify-center'>
                    <div className='py-2 flex items-center'>
                      <span className='text-sky-500 text-4xl mx-4'>&bull;</span>
                      <p>RARITY: {coverVariant.toUpperCase()}</p>
                    </div>
                    <div className='py-2 flex items-center border-t-2 border-t-sky-500 border-b-2 border-b-sky-500'>
                      <span className='text-sky-500 text-4xl mx-4'>&bull;</span>
                      <p>
                        CLAIM STATUS: {isClaimed ? <span className='text-green-500'>CLAIMED</span> : <span className='text-red-600'>UNCLAIMED</span>}
                        {level < 2 ? <span className='text-sky-500'> (MUST BE LEVEL 2)</span> : null}
                      </p>
                    </div>
                    <div className='py-2 flex items-center'>
                      <span className='text-sky-500 text-4xl mx-4'>&bull;</span>
                      <p>
                        LEVEL:{' '}
                        <span className={level === 1 ? 'text-yellow-400' : level === 2 ? 'text-green-600' : level === 3 ? 'text-sky-500' : ''}>
                          LEVEL {level}
                        </span>
                      </p>
                    </div>
                  </div>
                </td>

                <td className={idx === populatedWallet.tokens.length - 1 ? '' : 'border-b-2 border-b-sky-500'}>
                  <div className='py-8 px-4 flex items-center justify-center'>
                    <button
                      type='button'
                      disabled={true}
                      className='w-32 py-2 text-center text-xl rounded-lg border bg-gradient-to-b from-[#003E3A] to-[#001027] hover:bg-gradient-to-b hover:from-[#005E3A] hover:to-[#001027] disabled:opacity-40 disabled:cursor-not-allowed'
                    >
                      COMING SOON
                    </button>

                    {/* <button
                      type='button'
                      disabled={level !== 2}
                      className='w-32 py-2 text-center text-xl rounded-lg border bg-gradient-to-b from-[#003E3A] to-[#001027] hover:bg-gradient-to-b hover:from-[#005E3A] hover:to-[#001027] disabled:opacity-40 disabled:cursor-not-allowed'
                    >
                      LEVEL UP
                    </button> */}
                  </div>
                </td>

                <td className={idx === populatedWallet.tokens.length - 1 ? '' : 'border-b-2 border-b-sky-500'}>
                  <div className='py-8 px-4 flex items-center justify-center'>
                    {isClaimed ? (
                      <div className='w-32 py-2 text-center text-xl rounded-lg bg-green-700'>CLAIMED</div>
                    ) : level < 2 ? (
                      <div className='w-32 py-2 text-center text-xl rounded-lg bg-zinc-800'>NOT ELIGIBLE</div>
                    ) : (
                      <Link
                        href='/redeem'
                        className='w-32 py-2 text-center text-xl rounded-lg bg-gradient-to-b from-[#00C2FF] to-[#001C3E] hover:bg-gradient-to-b hover:from-[#00E2FF] hover:to-[#001C3E]'
                      >
                        CLAIM
                      </Link>
                    )}
                  </div>
                </td>

                <td className={idx === populatedWallet.tokens.length - 1 ? '' : 'border-b-2 border-b-sky-500'}>
                  <div className='py-8 px-4 flex items-center justify-center'>
                    <button
                      type='button'
                      onClick={toggleReader}
                      className='w-32 py-2 text-center text-xl rounded-lg border bg-gradient-to-b from-[#003E3A] to-[#001027] hover:bg-gradient-to-b hover:from-[#005E3A] hover:to-[#001027] disabled:opacity-40 disabled:cursor-not-allowed'
                    >
                      READ
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      <Modal open={openReader} onClose={toggleReader}>
        <iframe allowFullScreen src='https://heyzine.com/flip-book/484669daa8.html' className='w-[80vw] h-[80vh] m-4 rounded-xl' />
      </Modal>
    </main>
  )
}

export default Page
