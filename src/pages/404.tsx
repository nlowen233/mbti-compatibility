import { Head } from '@/components/Head'
import { MainWrapper } from '@/components/MainWrapper'
import { Paths } from '@/misc/Paths'
import { Button, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'

export default function NotFound() {
  const { palette } = useTheme()
  const router = useRouter()
  return (
    <>
      <Head />
      <MainWrapper>
        <div
          style={{
            height: '100vh',
            width: '100%',
            backgroundColor: palette.background.default,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: 30, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h1" textAlign={'center'}>
              404 - Sorry bud, not sure whatcha want
            </Typography>
            <Button onClick={() => router.push(Paths.home)}>{`Take me home friend, I'm lost`}</Button>
          </div>
        </div>
      </MainWrapper>
    </>
  )
}
