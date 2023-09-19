import Link from 'next/link'
import Image from 'next/image'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import XIcon from '@/icons/X'
import DiscordIcon from '@/icons/Discord'
import { LINKS } from '@/constants'

const Footer = () => {
  return (
    <footer className='py-8 flex flex-col items-center justify-center bg-black'>
      <div className='mb-4'>
        <Image src='/media/logo.png' alt='logo' priority unoptimized width={130} height={130} />
      </div>

      <p className='my-0.5 text-zinc-400 text-xs'>ALL RIGHTS RESERVED - &copy; THE MALLARD ORDER {new Date().getFullYear()}</p>
      <p className='my-0.5 text-zinc-400 text-xs'>PRIVACY POLICY | LICENSE AGREEMENT</p>

      <div className='mt-4 flex'>
        <Link
          href={LINKS['WEBSITE']}
          target='_blank'
          rel='noopener noreferrer'
          className='group w-6 h-6 m-1 rounded-full bg-sky-500 hover:bg-sky-300 flex items-center justify-center'
        >
          <GlobeAltIcon className='w-5 h-5 text-black group-hover:text-zinc-600' />
        </Link>
        <Link
          href={LINKS['X']}
          target='_blank'
          rel='noopener noreferrer'
          className='group w-6 h-6 m-1 rounded-full bg-sky-500 hover:bg-sky-300 flex items-center justify-center'
        >
          <XIcon className='w-6 h-6 fill-black group-hover:fill-zinc-600' />
        </Link>
        <Link
          href={LINKS['DISCORD']}
          target='_blank'
          rel='noopener noreferrer'
          className='group w-6 h-6 m-1 rounded-full bg-sky-500 hover:bg-sky-300 flex items-center justify-center'
        >
          <DiscordIcon className='w-4 h-4 fill-black group-hover:fill-zinc-600' />
        </Link>
      </div>
    </footer>
  )
}

export default Footer
