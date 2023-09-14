import Link from 'next/link'
import Image from 'next/image'
import { Fragment } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Auth from './Auth'

const Header = () => {
  const { populatedWallet } = useAuth()

  return (
    <header id='header' className='sticky top-0 z-20 p-4 flex items-start justify-between'>
      <Link href='/' className='flex flex-col items-center'>
        <Image src='/media/logo.png' alt='logo' priority unoptimized width={150} height={150} />
        <h1 className='text-2xl whitespace-nowrap'>COMICS</h1>
      </Link>

      <div className='flex flex-wrap items-start justify-end'>
        {populatedWallet?.stakeKey ? (
          <Fragment>
            <Link
              href='/leaderboard'
              className='min-w-[150px] m-1 p-2 flex items-center justify-center rounded-full border border-sky-700 hover:border-neutral-50 focus:border-neutral-50 bg-transparent disabled:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Leaderboard
            </Link>
            <Link
              href='/inventory'
              className='min-w-[150px] m-1 p-2 flex items-center justify-center rounded-full border border-sky-700 hover:border-neutral-50 focus:border-neutral-50 bg-transparent disabled:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
            >
              My Inventory
            </Link>
          </Fragment>
        ) : null}

        <Auth />
      </div>
    </header>
  )
}

export default Header
