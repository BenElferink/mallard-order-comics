import Image from 'next/image'
import { Antonio, Imbue } from 'next/font/google'

const imbue = Imbue({ weight: '300', subsets: ['latin'] })
const antonio = Antonio({ weight: '300', subsets: ['latin'] })

const Page = () => {
  return (
    <main className='min-h-screen flex flex-col items-center'>
      <div className='flex'>
        {['common', 'rare', 'super_rare', 'mythic'].map((rarity) => (
          <div key={rarity} className='mx-2 sm:mx-4'>
            <Image
              src={`/media/cover_varients/${rarity}.jpeg`}
              alt={rarity}
              width={220}
              height={340}
              className='w-[220px] border-2 border-yellow-900 drop-shadow-[0_0_0.5rem_rgba(0,0,0,1)]'
              priority
              unoptimized
            />
            <div className={`mt-2 text-center text-sm sm:text-xl font-normal ${antonio.className}`}>{rarity.toUpperCase().replaceAll('_', ' ')}</div>
          </div>
        ))}
      </div>

      <div className={`mt-8 sm:mt-12 text-center text-4xl sm:text-6xl font-normal ${imbue.className}`}>
        GAIN POINTS FOR COLLECTING EDITIONS OF TMO COMICS!
      </div>
    </main>
  )
}

export default Page
