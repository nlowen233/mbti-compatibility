import Head from 'next/head'
import { MainWrapper } from '@/components/MainWrapper'
import {useEffect, useContext} from 'react'
import { SessionContext } from '@/contexts/SessionContext'
import { useRouter } from 'next/router'

export default function Test() {

  const router = useRouter()
  const {testToken} = useContext(SessionContext)
  const {status}= useContext(SessionContext)

  useEffect(()=>{
    if(!testToken&&status!=='not_checked_token'){
        //router.push('/') COMMENTED FOR TESTING
    }
  },[testToken,status])

  return (
    <>
      <Head>
        <title>MBTI Compatibility Test</title>
        <meta name="Find your MBTI match" content="Start your test to find who you are compatible with" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainWrapper>
        
      </MainWrapper>
    </>
  )
}
