import { useTheme } from '@mui/material'
import React from 'react'

type Props = {
  children: React.ReactNode
}

export const MainWrapper = ({ children }: Props) => {
  const { palette } = useTheme()
  return (
    <main style={{ backgroundColor: palette.background.default, minHeight: '100vh', minWidth: 250, paddingTop: 30, paddingBottom: 30 }}>
      {children}
    </main>
  )
}
