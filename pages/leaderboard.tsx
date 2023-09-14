import { useEffect, useState } from 'react'
import api from '@/utils/api'
import populateLeaderboard from '@/functions/populateLeaderboard'
import Loader from '@/components/Loader'
import type { PopulatedToken } from '@/@types'
import { POLICY_IDS } from '@/constants'

const Page = () => {
  const [loading, setLoading] = useState(false)
  const [leaderboard, setLeaderboard] = useState<
    {
      walletId: string
      points: number
    }[]
  >([])

  useEffect(() => {
    setLoading(true)

    api.policy
      .getData(POLICY_IDS['COMICS_ISSUE_ONE'])
      .then(({ tokens }) => {
        const payload = Object.entries(populateLeaderboard(tokens as PopulatedToken[]))
          .map(([walletId, points]) => ({
            walletId,
            points,
          }))
          .sort((a, b) => b.points - a.points)

        setLeaderboard(payload)
      })
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className='min-h-screen flex flex-col items-center'>
      <h2 className='text-2xl'>COLLECTOR'S LEADERBOARD</h2>

      {loading ? (
        <Loader />
      ) : (
        <table className='border-collapse'>
          <thead>
            <tr>
              <th className='p-2 text-start'>PLACE</th>
              <th className='p-2 text-start'>NAME</th>
              <th className='p-2 text-start'>COLLECTORS POINTS</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map(({ walletId, points }, idx) => (
              <tr key={walletId}>
                <td className='p-2 text-center'>{idx + 1}</td>
                <td className='p-2'>{walletId}</td>
                <td className='p-2 text-center'>{points} POINTS</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}

export default Page
