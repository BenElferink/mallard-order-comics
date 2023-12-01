import Link from 'next/link'
import { Antonio, Imbue } from 'next/font/google'
import { useData } from '@/contexts/DataContext'
import getSerialStringFromSerialNumber from '@/functions/getSerialStringFromSerialNumber'
import Auth from '@/components/Auth'
import Loader from '@/components/Loader'
import UpgradeIcon from '@/icons/Upgrade'
import { Fragment } from 'react'
import Cover from '@/components/Cover'
import ReadComic from '@/components/ReadComic'

const antonio = Antonio({ weight: '300', subsets: ['latin'] })
const imbue = Imbue({ weight: '300', subsets: ['latin'] })

const Page = () => {
  const { populatingWallet, populatedWallet } = useData()
  const holderTokens = populatedWallet?.tokens || []

  if (!populatedWallet?.stakeKey) {
    return (
      <main className='min-h-screen flex items-start justify-center'>
        <div>{populatingWallet ? <Loader /> : <Auth />}</div>
      </main>
    )
  }

  const LevelUpButton = ({ level }: { level: number }) => {
    return (
      <Fragment>
        <button
          type='button'
          disabled={true}
          className='w-32 py-2 text-center text-xl rounded-lg border bg-gradient-to-b from-[#003E3A] to-[#001027] hover:bg-gradient-to-b hover:from-[#005E3A] hover:to-[#001027] disabled:opacity-40 disabled:cursor-not-allowed'
        >
          COMING SOON
        </button>

        {/* <button
          type='button'
          disabled={level !== 1}
          className='w-32 py-2 text-center text-xl rounded-lg border bg-gradient-to-b from-[#003E3A] to-[#001027] hover:bg-gradient-to-b hover:from-[#005E3A] hover:to-[#001027] disabled:opacity-40 disabled:cursor-not-allowed'
        >
          LEVEL UP
        </button> */}
      </Fragment>
    )
  }
  const ClaimButton = ({ level, isClaimed }: { level: number; isClaimed: boolean }) => {
    return (
      <Fragment>
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
      </Fragment>
    )
  }
  const ReadButton = () => {
    return (
      <ReadComic className='w-32 py-2 text-center text-xl rounded-lg border bg-gradient-to-b from-[#003E3A] to-[#001027] hover:bg-gradient-to-b hover:from-[#005E3A] hover:to-[#001027] disabled:opacity-40 disabled:cursor-not-allowed' />
    )
  }

  return (
    <main className={`min-h-screen p-4 flex flex-col items-center ${antonio.className}`}>
      <h2 className={`mb-8 text-center text-4xl sm:text-6xl ${imbue.className}`}>MY INVENTORY</h2>

      <div className='w-full mb-8 p-8 flex items-center justify-center rounded-lg bg-red-950/80 text-xl sm:text-3xl'>
        TOTAL COLLECTOR&apos;S POINTS:{' '}
        <span className='w-2/5 p-4 ml-8 text-center rounded-lg border border-red-800 bg-red-950'>{populatedWallet.points} POINTS</span>
      </div>

      <table className='w-full border-separate border-spacing-0 border border-sky-500 rounded-lg bg-black/60'>
        <thead className={`hidden sm:table-header-group border-b-2 border-b-sky-500 ${antonio.className}`}>
          <tr>
            <th className='py-4 border-b-2 border-b-sky-500 text-center text-2xl'>
              <span className='flex items-center justify-center'>ISSUE #</span>
            </th>
            <th className='py-4 border-b-2 border-b-sky-500 text-center text-2xl'>
              <span className='flex items-center justify-center'>STATS</span>
            </th>
            <th className='py-4 border-b-2 border-b-sky-500 text-center text-2xl'>
              <span className='flex items-center justify-center'>
                UPGRADE <UpgradeIcon className='w-4 ml-2' />
              </span>
            </th>
            <th className='py-4 border-b-2 border-b-sky-500 text-center text-2xl'>
              <span className='flex items-center justify-center'>REDEMPTION</span>
            </th>
            <th className='py-4 border-b-2 border-b-sky-500 text-center text-2xl'>
              <span className='flex items-center justify-center'>READ</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {holderTokens.map(({ tokenId, serialNumber, coverVariant, isClaimed, level }, idx) => {
            return (
              <tr key={tokenId} className='flex flex-wrap sm:table-row'>
                <td className={'w-full sm:w-fit ' + (idx === holderTokens.length - 1 ? '' : 'sm:border-b-2 sm:border-b-sky-500')}>
                  <div className='pt-8 sm:py-8 px-4 flex justify-evenly'>
                    <div className='flex flex-col sm:flex-row flex-wrap items-center justify-center'>
                      <div className='w-[150px] sm:w-[100px]'>
                        <Cover variant={coverVariant} className='border border-amber-500' />
                      </div>
                      <span className='m-4 text-2xl'>{getSerialStringFromSerialNumber(serialNumber)}</span>
                    </div>

                    <div className='flex flex-col sm:hidden'>
                      <div className='mb-2 flex flex-col items-center justify-center'>
                        <span className='mb-0.5 flex items-center justify-center'>
                          UPGRADE <UpgradeIcon className='w-3 ml-2' />
                        </span>
                        <LevelUpButton level={level} />
                      </div>

                      <div className='mb-2 flex flex-col items-center justify-center'>
                        <span className='mb-0.5 flex items-center justify-center'>REDEMPTION</span>
                        <ClaimButton level={level} isClaimed={isClaimed} />
                      </div>

                      <div className='mb-2 flex flex-col items-center justify-center'>
                        <span className='mb-0.5 flex items-center justify-center'>READ</span>
                        <ReadButton />
                      </div>
                    </div>
                  </div>
                </td>

                <td className={'w-full sm:w-fit ' + (idx === holderTokens.length - 1 ? '' : 'border-b-2 border-b-sky-500')}>
                  <div className='pb-8 sm:py-8 px-4 flex flex-col justify-center'>
                    <div className='py-2 flex items-center'>
                      <span className='hidden sm:inline text-sky-500 text-4xl mx-4'>&bull;</span>
                      <p className='w-full text-center sm:text-start'>RARITY: {coverVariant.toUpperCase()}</p>
                    </div>
                    <div className='py-2 flex items-center border-t-2 border-b-2 border-t-white/50 border-b-white/50 sm:border-t-sky-500 sm:border-b-sky-500'>
                      <span className='hidden sm:inline text-sky-500 text-4xl mx-4'>&bull;</span>
                      <p className='w-full text-center sm:text-start'>
                        CLAIM STATUS: {isClaimed ? <span className='text-green-500'>CLAIMED</span> : <span className='text-red-600'>UNCLAIMED</span>}
                        {level === 1 ? <span className='text-sky-500'> (MUST BE LEVEL 2)</span> : null}
                      </p>
                    </div>
                    <div className='py-2 flex items-center'>
                      <span className='hidden sm:inline text-sky-500 text-4xl mx-4'>&bull;</span>
                      <p className='w-full text-center sm:text-start'>
                        LEVEL:{' '}
                        <span className={level === 1 ? 'text-yellow-400' : level === 2 ? 'text-green-600' : level === 3 ? 'text-sky-500' : ''}>
                          LEVEL {level}
                        </span>
                      </p>
                    </div>
                  </div>
                </td>

                <td className={'hidden sm:table-cell ' + (idx === holderTokens.length - 1 ? '' : 'border-b-2 border-b-sky-500')}>
                  <div className='py-8 px-4 flex items-center justify-center'>
                    <LevelUpButton level={level} />
                  </div>
                </td>

                <td className={'hidden sm:table-cell ' + (idx === holderTokens.length - 1 ? '' : 'border-b-2 border-b-sky-500')}>
                  <div className='py-8 px-4 flex items-center justify-center'>
                    <ClaimButton level={level} isClaimed={isClaimed} />
                  </div>
                </td>

                <td className={'hidden sm:table-cell ' + (idx === holderTokens.length - 1 ? '' : 'border-b-2 border-b-sky-500')}>
                  <div className='py-8 px-4 flex items-center justify-center'>
                    <ReadButton />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </main>
  )
}

export default Page
