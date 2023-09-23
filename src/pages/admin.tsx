import Head from 'next/head'
import { MainWrapper } from '@/components/MainWrapper'
import {useEffect, useContext} from 'react'
import { useRouter } from 'next/router'
import { API } from '@/misc/API'
import { UserContext } from '@auth0/nextjs-auth0/client'

export default function Test() {

  const router = useRouter()
  const {user} = useContext(UserContext)

  useEffect(()=>{
    if(!user){
      router.push('/api/auth/login?returnTo=/admin')
    }
  },[user])

  return (
    <>
      <Head>
        <title>MBTI Compatibility Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainWrapper>
        <div>
          Test
        </div>
        <button onClick={()=>API.updateQuestion({})}>
          TEST 2
        </button>
      </MainWrapper>
    </>
  )
}
