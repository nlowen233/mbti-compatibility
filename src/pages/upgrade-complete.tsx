import { Head } from '@/components/Head'
import { MainWrapper } from '@/components/MainWrapper'
import { Typography, useTheme } from '@mui/material'

export default function UpgradeComplete() {
  const { palette } = useTheme()
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
              Your purchase was a success, you will get an email, with the link to your new results when they are ready (usually takes less
              than five minutes)
            </Typography>
            <Typography variant="h2" textAlign={'center'}>
              Alternatively, you can remain on this page, and we will redirect you when your results are complete!
            </Typography>
          </div>
        </div>
      </MainWrapper>
    </>
  )
}
