import { useAuth } from '@/contexts/AuthContext'

const Page = () => {
  const { populatedWallet } = useAuth()

  return <main className='min-h-screen'>{JSON.stringify(populatedWallet)}</main>
}

export default Page
