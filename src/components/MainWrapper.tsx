import React from 'react'
import {useTheme} from '@mui/material'

type Props = {
    children: React.ReactNode
}

export const MainWrapper = ({children}:Props) => {
    const {palette} = useTheme()
  return (
    <main style={{backgroundColor:palette.background.default,minHeight:'100vh'}}>
        {children}
    </main>
  )
}
