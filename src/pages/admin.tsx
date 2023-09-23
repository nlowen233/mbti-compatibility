import Head from 'next/head'
import { MainWrapper } from '@/components/MainWrapper'
import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { API } from '@/misc/API'
import { UserContext } from '@auth0/nextjs-auth0/client'
import { Constants } from '@/misc/Constants'

export default function Test() {
  const router = useRouter()
  const { user, isLoading } = useContext(UserContext)

  useEffect(() => {
    if (!user&&!isLoading) {
      router.push('/api/auth/login?returnTo=/admin')
    }
  }, [user,isLoading])
  
  return (
    <>
      <Head>
        <title>MBTI Compatibility Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainWrapper>
        
      </MainWrapper>
    </>
  )
}
