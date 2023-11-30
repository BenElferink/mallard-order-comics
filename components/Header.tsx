import Link from 'next/link'
import Image from 'next/image'
import { Antonio } from 'next/font/google'
import { useData } from '@/contexts/DataContext'
import Auth from './Auth'
import ReadComic from './ReadComic'

const antonio = Antonio({ weight: '300', subsets: ['latin'] })

const Header = () => {
  const { populatedWallet } = useData()

  return (
    <header id='header' className={`py-8 sm:py-16 px-4 sm:px-12 flex items-start justify-between ${antonio.className}`}>
      <Link href='/' className='flex flex-col items-center'>
        <Image src='/media/logo.png' alt='logo' width={130} height={130} priority unoptimized />
        <Image src='/media/comics.svg' alt='comics' width={100} height={50} className='mt-2' priority unoptimized />
      </Link>

      <div className='flex flex-col sm:flex-row-reverse items-end sm:items-start justify-end'>
        <Auth />

        {populatedWallet?.stakeKey ? (
          <div className='flex flex-col sm:flex-row sm:flex-wrap justify-end'>
            <Link
              href='/leaderboard'
              className='min-w-[200px] m-1 p-3 flex items-center justify-center rounded-full border border-sky-500 hover:border-neutral-50 focus:border-neutral-50 bg-transparent disabled:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
            >
              LEADERBOARD
            </Link>
            <Link
              href='/inventory'
              className='min-w-[200px] m-1 p-3 flex items-center justify-center rounded-full border border-sky-500 hover:border-neutral-50 focus:border-neutral-50 bg-transparent disabled:border-transparent disabled:opacity-50 disabled:cursor-not-allowed'
            >
              MY INVENTORY
            </Link>
            <ReadComic />
          </div>
        ) : null}
      </div>
    </header>
  )
}

export default Header
