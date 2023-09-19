import { Antonio, Imbue } from 'next/font/google'
import { useEffect, useMemo, useState } from 'react'
import { useData } from '@/contexts/DataContext'
import populateLeaderboard from '@/functions/populateLeaderboard'
import Loader from '@/components/Loader'

const imbue = Imbue({ weight: '300', subsets: ['latin'] })
const antonio = Antonio({ weight: '300', subsets: ['latin'] })

const Page = () => {
  const { populatingWallet, populatedWallet, populatingTokens, populatedTokens } = useData()

  const rowsPerPage = 50
  const [maxPages, setMaxPages] = useState(1)
  const [page, setPage] = useState(1)
  const [leaderboard, setLeaderboard] = useState<
    {
      walletId: string
      handle: string
      points: number
    }[]
  >([])

  const myIndexOnBoard = useMemo(() => leaderboard.findIndex((row) => row.walletId === populatedWallet?.stakeKey), [leaderboard, populatedWallet])

  useEffect(() => {
    if (populatedTokens.length) {
      const payload = populateLeaderboard(populatedTokens)

      setLeaderboard(payload)
      setMaxPages(Math.ceil(payload.length / rowsPerPage))
    }
  }, [populatedTokens])

  return (
    <main className='min-h-screen mb-12 px-12 flex flex-col items-center'>
      <h2 className={`mb-8 text-center text-4xl sm:text-6xl font-normal ${imbue.className}`}>COLLECTOR&apos;S LEADERBOARD</h2>

      <div className='max-w-[900px] w-full flex flex-col items-center'>
        {populatedWallet ? (
          <table className='w-full mb-8 border-separate border-spacing-0 border rounded-lg bg-sky-950/80'>
            <thead className='border-b-2'>
              <tr>
                <th className={`p-4 border-b-2 text-cyan-400 text-center text-2xl ${antonio.className}`}>YOUR PLACE</th>
                <th className={`p-4 border-b-2 text-cyan-400 text-start text-2xl ${antonio.className}`}>YOUR NAME</th>
                <th className={`p-4 border-b-2 text-cyan-400 text-center text-2xl ${antonio.className}`}>YOUR POINTS</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='py-8 px-4 text-center'>{myIndexOnBoard !== -1 ? myIndexOnBoard + 1 : 0}</td>
                <td className='py-8 px-4 text-start'>
                  {myIndexOnBoard !== -1
                    ? leaderboard[myIndexOnBoard].handle || leaderboard[myIndexOnBoard].walletId
                    : populatedWallet.handle || populatedWallet.stakeKey}
                </td>
                <td className='py-8 px-4 text-center'>{myIndexOnBoard !== -1 ? leaderboard[myIndexOnBoard].points : 0} POINTS</td>
              </tr>
            </tbody>
          </table>
        ) : populatingWallet ? (
          <div className='my-8'>
            <Loader />
          </div>
        ) : null}

        {leaderboard.length ? (
          <table className='w-full border-separate border-spacing-0 border border-sky-500 rounded-lg bg-gray-950/80'>
            <thead className='border-b-2 border-b-sky-500'>
              <tr>
                <th className={`py-4 px-8 border-b-2 border-b-sky-500 text-cyan-400 text-center text-2xl ${antonio.className}`}>PLACE</th>
                <th className={`py-4 border-b-2 border-b-sky-500 text-cyan-400 text-start text-2xl ${antonio.className}`}>NAME</th>
                <th className={`py-4 px-8 border-b-2 border-b-sky-500 text-cyan-400 text-center text-2xl ${antonio.className}`}>COLLECTORS POINTS</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map(({ walletId, handle, points }, idx) => {
                const minRange = page * rowsPerPage - rowsPerPage
                const maxRange = page * rowsPerPage - 1

                return idx >= minRange && idx <= maxRange ? (
                  <tr key={walletId}>
                    <td className={`py-2 ${idx === minRange ? 'pt-8' : ''} text-center`}>{idx + 1}</td>
                    <td className={`py-2 ${idx === minRange ? 'pt-8' : ''} text-start`}>{handle || walletId}</td>
                    <td className={`py-2 ${idx === minRange ? 'pt-8' : ''} text-center`}>{points} POINTS</td>
                  </tr>
                ) : null
              })}

              <tr>
                <td colSpan={3}>
                  <div className='w-full my-8 flex items-center justify-center'>
                    {new Array(maxPages).fill(1).map((one, idx) => {
                      const thisPage = idx + one

                      return (
                        <button
                          key={`page-${thisPage}`}
                          onClick={() => setPage(thisPage)}
                          className={`mx-2 font-normal text-xl ${page === thisPage ? 'text-red-600' : ''} ${antonio.className}`}
                        >
                          {thisPage}
                        </button>
                      )
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        ) : populatingTokens ? (
          <div className='my-8'>
            <Loader />
          </div>
        ) : null}
      </div>
    </main>
  )
}

export default Page
