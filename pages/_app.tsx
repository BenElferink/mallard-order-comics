import type { AppProps } from 'next/app'
import { Roboto } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { MeshProvider } from '@meshsdk/react'
import { AuthProvider } from '@/contexts/AuthContext'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import '@/styles/globals.css'

const inter = Roboto({ weight: '300', subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.className}>
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
