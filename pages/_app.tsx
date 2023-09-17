import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { MeshProvider } from '@meshsdk/react'
import { AuthProvider } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import '@/styles/globals.css'

const inter = Inter({ weight: '300', subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>TMO - Comics</title>
      </Head>

      <Toaster />

      <MeshProvider>
        <AuthProvider>
          <Header />
          <Component {...pageProps} />
          <Footer />
        </AuthProvider>
      </MeshProvider>
    </div>
  )
}
