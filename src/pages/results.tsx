import { MainWrapper } from '@/components/MainWrapper'
import { useEffect, useContext } from 'react'
import { useRouter } from 'next/router'
import { UserContext } from '@auth0/nextjs-auth0/client'
import {Typography} from '@mui/material'
import { Head } from '@/components/Head'

export default function Test() {
  const router = useRouter()
  const { user, isLoading } = useContext(UserContext)
  
  return (
    <>
      <Head/>
      <MainWrapper>
        <Typography variant='h3' style={{textAlign:'center',padding:20}}>
            Results
        </Typography>
      </MainWrapper>
    </>
  )
}
