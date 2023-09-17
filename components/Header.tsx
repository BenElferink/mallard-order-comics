import Link from 'next/link'
import Image from 'next/image'
import { Antonio } from 'next/font/google'
import { Fragment } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Auth from './Auth'

const antonio = Antonio({ weight: '300', subsets: ['latin'] })

const Header = () => {
  const { populatedWallet } = useAuth()

  return (
    <header id='header' className='pt-8 sm:pt-20 pb-20 px-4 sm:px-12 flex items-start justify-between'>
      <Link href='/' className='flex flex-col items-center'>
        <Image src='/media/logo.png' alt='logo' width={130} height={130} />
        <Image src='/media/comics.svg' alt='comics' width={100} height={50} className='mt-2' />
      </Link>

      <div className='flex flex-wrap items-start justify-end'>
        {populatedWallet?.stakeKey ? (
          <Fragment>
            <Link
              href='/leaderboard'
              className={`min-w-[200px] m-1 p-3 flex items-center justify-center rounded-full border border-sky-500 hover:border-neutral-50 focus:border-neutral-50 bg-transparent disabled:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${antonio.className}`}
            >
              LEADERBOARD
            </Link>
            <Link
              href='/inventory'
              className={`min-w-[200px] m-1 p-3 flex items-center justify-center rounded-full border border-sky-500 hover:border-neutral-50 focus:border-neutral-50 bg-transparent disabled:border-transparent disabled:opacity-50 disabled:cursor-not-allowed ${antonio.className}`}
            >
              MY INVENTORY
            </Link>
          </Fragment>
        ) : null}

        <Auth />
      </div>
    </header>
  )
}

export default Header
