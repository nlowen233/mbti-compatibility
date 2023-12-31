import { Head } from '@/components/Head'
import { MainWrapper } from '@/components/MainWrapper'
import { PopUpContext } from '@/contexts/PopUpContext'
import { API } from '@/misc/API'
import { Paths } from '@/misc/Paths'
import { CircularProgress, Typography } from '@mui/material'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

const FUNC_RUN_INTERVAL_IN_SEC = 10
const FUNC_RUN_LIMIT = 50
const STRIPE_SUCCESS = 'succeeded'
const FAILURE_REDIRECT_TIME_IN_SEC = 10

type Props = {
  successfulPurchase: boolean
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  return {
    props: {
      successfulPurchase: query.redirect_status === STRIPE_SUCCESS,
    },
  }
}

export default function UpgradeComplete({ successfulPurchase }: Props) {
  const { pushPopUpMessage } = useContext(PopUpContext)
  const router = useRouter()
  const testID = router.query.id as string | undefined
  const [initRender, setInitRender] = useState(true)
  const [redirectFailed, setRedirectFailed] = useState(false)
  const [execCount, setExecCount] = useState(0)

  const redirectIfTestComplete = async () => {
    setExecCount((c) => c + 1)
    if (!testID) {
      return
    }
    const isComplete = await API.checkIsTestUpgradeComplete({ id: testID })
    if (isComplete.res) {
      router.push(`${Paths.results}/${testID}`)
    } else if (isComplete.err) {
      setRedirectFailed(true)
      pushPopUpMessage({
        message: 'There was an error attempting to redirect you, this page will no longer attempt to redirect',
        title: 'Redirect Error',
        type: 'error',
      })
    }
  }

  useEffect(() => {
    if (initRender) {
      return
    }
    if (redirectFailed || !successfulPurchase) {
      return
    }
    let interval: NodeJS.Timeout | undefined
    if (initRender) {
      redirectIfTestComplete()
    } else {
      interval = setInterval(redirectIfTestComplete, FUNC_RUN_INTERVAL_IN_SEC * 1000)
    }
    return () => {
      !!interval && clearInterval(interval)
    }
  }, [redirectFailed, redirectIfTestComplete])

  useEffect(() => {
    if (execCount >= FUNC_RUN_LIMIT) {
      setRedirectFailed(true)
    }
  }, [execCount])

  useEffect(() => {
    if (initRender) {
      setInitRender(false)
    }
  }, [])
  return (
    <>
      <Head />
      <MainWrapper>
        <div
          style={{
            padding: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '80vh',
            minHeight: 600,
          }}
        >
          <Typography variant="h1" textAlign={'center'} paddingBottom={4}>
            {successfulPurchase ? `Your purchase was a success!` : `Your purchase failed, please contact support if this issue persists`}
          </Typography>
          <CircularProgress />
          <Typography variant="body1" textAlign={'center'} paddingTop={2} style={{ maxWidth: 800 }}>
            {successfulPurchase
              ? `You will be redirected to your upgraded test results when they are ready! This usually takes about 5-10 minutes, otherwise you
            can find your test in "My Tests". If you experience any issues please contact our support team using the support link under
            the gear icon.`
              : `Sorry about this, please give it another try!`}
          </Typography>
        </div>
      </MainWrapper>
    </>
  )
}
