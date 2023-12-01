import { Imbue } from 'next/font/google'
import { useState } from 'react'
import { MinusCircleIcon, PlusCircleIcon } from '@heroicons/react/24/outline'
import Cover from './Cover'
import { COVER_VARIANTS } from '@/constants'

const imbue = Imbue({ weight: '300', subsets: ['latin'] })

const HowPointsWork = () => {
  const [expandInfo, setExpandInfo] = useState(false)

  return (
    <div className='sm:hidden'>
      <button
        type='button'
        onClick={() => setExpandInfo((prev) => !prev)}
        className={`relative w-screen py-2 text-2xl bg-red-950 ${imbue.className}`}
      >
        HOW POINTS WORK
        {expandInfo ? (
          <MinusCircleIcon className='w-8 h-8 absolute top-1/2 right-[1rem] -translate-y-1/2' />
        ) : (
          <PlusCircleIcon className='w-8 h-8 absolute top-1/2 right-[1rem] -translate-y-1/2' />
        )}
      </button>

      {expandInfo ? (
        <div>
          <p className='my-4 text-center'>COMIC POINT SYSTEM - BASE POINT ALLOCATION</p>

          <div className='flex items-center justify-center'>
            {COVER_VARIANTS.map((str) => {
              let points = 0

              switch (str) {
                case 'Common': {
                  points = 1
                  break
                }
                case 'Rare': {
                  points = 10
                  break
                }
                case 'Super Rare': {
                  points = 20
                  break
                }
                case 'Mythic': {
                  points = 2000
                  break
                }
                default: {
                  points = 0
                  break
                }
              }

              return (
                <div key={str} className='max-w-[80px] w-fit mx-2 flex flex-col items-center'>
                  <Cover variant={str} className='border-2 border-yellow-900 drop-shadow-[0_0_0.5rem_rgba(0,0,0,1)]' />
                  <span className='my-2 text-sm'>{str}</span>
                  <span className='text-center'>
                    {points}
                    <br />
                    POINTS
                  </span>
                </div>
              )
            })}
          </div>

          <div className='max-w-[310px] mt-4 mx-auto p-4 text-center rounded bg-black/60 flex flex-col items-center justify-center'>
            <p className='my-2 text-2xl text-cyan-400'>Weighted Leaderboard based on Serial # Range</p>
            <ul className='my-2 text-2xl'>
              <li>(#1) = 500 Points</li>
              <li>(#2-5) = 100 Points</li>
              <li>(#6-10) = 50 Points</li>
              <li>(#11-100) = 25 Points</li>
            </ul>
            <p className='my-2 text-xl text-cyan-400'>Points from Serial Numbers and multiple covers add together</p>
            <p className='my-2 text-xl text-cyan-400'>A weighted giveaway takes place to determine final reward distribution</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default HowPointsWork
