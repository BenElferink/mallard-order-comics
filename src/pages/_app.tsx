import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { MeshProvider } from '@meshsdk/react'
import { DataProvider } from '@/contexts/DataContext'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import '@/styles/globals.css'

const inter = Inter({ weight: '300', subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <div className={`max-w-[1400px] mx-auto ${inter.className}`}>
        <Head>
          <meta name='viewport' content='width=device-width, initial-scale=1.0' />
          <meta name='author' content='Ben Elferink' />
          <meta name='keywords' content='cardano, blockchain, nft, comics, leaderboard, community' />
          <meta name='description' content='' />

          <link rel='icon' type='image/x-icon' href='/favicon.ico' />
          <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />
          <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
          <link rel='apple-touch-icon' sizes='180x180' href='/apple-touch-icon.png' />
          <link rel='manifest' href='/manifest.json' />

          <title>TMO - Comics</title>
        </Head>

        <Toaster />

        <MeshProvider>
          <DataProvider>
            <Header />
            <Component {...pageProps} />
          </DataProvider>
        </MeshProvider>
      </div>

      <Footer />
    </div>
  )
}
