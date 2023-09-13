import Link from 'next/link'
import Image from 'next/image'
import { GlobeAltIcon } from '@heroicons/react/24/outline'
import XIcon from '@/icons/X'
import DiscordIcon from '@/icons/Discord'

const Footer = () => {
  return (
    <footer className='py-8 flex flex-col items-center justify-center bg-black'>
      <div className='mb-4'>
        <Image src='/media/logo.png' alt='logo' priority unoptimized width={150} height={150} />
      </div>

      <p className='my-0.5 text-zinc-400 text-xs'>ALL RIGHTS RESERVED - &copy; THE MALLARD ORDER {new Date().getFullYear()}</p>
      <p className='my-0.5 text-zinc-400 text-xs'>PRIVACY POLICY | LICENSE AGREEMENT</p>

      <div className='mt-4 flex'>
        <Link
          href='https://mallardorder.io'
          target='_blank'
          rel='noopener noreferrer'
          className='group w-6 h-6 m-1 rounded-full bg-cyan-400 hover:bg-cyan-200 flex items-center justify-center'
        >
          <GlobeAltIcon className='w-6 h-6 text-black group-hover:text-zinc-600' />
        </Link>
        <Link
          href='https://x.com/mallardorder'
          target='_blank'
          rel='noopener noreferrer'
          className='group w-6 h-6 m-1 rounded-full bg-cyan-400 hover:bg-cyan-200 flex items-center justify-center'
        >
          <XIcon className='w-6 h-6 fill-black group-hover:fill-zinc-600' />
        </Link>
        <Link
          href='https://discord.gg/mallardorder'
          target='_blank'
          rel='noopener noreferrer'
          className='group w-6 h-6 m-1 rounded-full bg-cyan-400 hover:bg-cyan-200 flex items-center justify-center'
        >
          <DiscordIcon className='w-5 h-5 fill-black group-hover:fill-zinc-600' />
        </Link>
      </div>
    </footer>
  )
}

export default Footer
