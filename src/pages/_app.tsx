import { LoadingOverlayWrapper } from '@/components/LoadingOverlay/LoadingOverlayWrapper'
import { PopUpWrapper } from '@/components/PopUpWrapper'
import { PopUpMessage } from '@/contexts/PopUpContext'
import { SessionContext } from '@/contexts/SessionContext'
import { Storage } from '@/misc/Storage'
import { Theme } from '@/misc/Theme'
import '@/styles/globals.css'
import { ProgressStatus } from '@/types/misc'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Answer, SQLTestAnswers } from '@/types/SQLTypes'
import { useMountlessEffect } from '@/hooks/useMountlessEffect'
import { API } from '@/misc/API'
import { Convert } from '@/misc/Convert'

export default function App({ Component, pageProps }: AppProps) {
  const [loadingOverlay, setLoadingOverlay] = useState(false)
  const [message, setMessage] = useState<PopUpMessage | undefined>(undefined)
  const [testToken, setTestToken] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<ProgressStatus>('not_checked_token')
  const [savedProgress, setSavedProgress] = useState<Answer[] | undefined>(undefined)
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeStart', () => setLoadingOverlay(true))
    router.events.on('routeChangeComplete', () => setLoadingOverlay(false))
  }, [])

  useEffect(() => {
    if (status === 'not_checked_token') {
      const token = Storage.getToken()
      if (token) {
        setTestToken(token)
        setStatus('has_token_will_attempt_resume')
      } else {
        setStatus('does_not_have_token')
      }
    }
  }, [status])

  useMountlessEffect(() => {
    if (status === 'has_token_will_attempt_resume') {
      setLoadingOverlay(true)
      API.getAnswersByTestID({ id: testToken as string })
        .then((res) => {
          if (res.err) {
            setStatus('could_not_restore_progress')
            Storage.clearToken()
            setTestToken(undefined)
          } else {
            const answers = res.res as SQLTestAnswers
            const converted = Convert.sqlToTestAnswers(answers)
            setSavedProgress(converted.answers)
            setStatus('successfully_restored_progress')
            router.push('/test')
          }
        })
        .finally(() => setLoadingOverlay(false))
    }
  }, [status])

  return (
    <ThemeProvider theme={Theme}>
      <UserProvider>
        <SessionContext.Provider value={{ setTestToken, testToken, savedProgress, status }}>
          <LoadingOverlayWrapper on={loadingOverlay} toggle={setLoadingOverlay}>
            <PopUpWrapper clearMessage={() => setMessage(undefined)} pushPopUpMessage={(msg) => setMessage(msg)} popUpMessage={message}>
              <Component {...pageProps} />
            </PopUpWrapper>
          </LoadingOverlayWrapper>
        </SessionContext.Provider>
      </UserProvider>
    </ThemeProvider>
  )
}
