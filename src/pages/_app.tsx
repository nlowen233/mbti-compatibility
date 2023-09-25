import { LoadingOverlayWrapper } from '@/components/LoadingOverlay/LoadingOverlayWrapper'
import { MenuWrapper } from '@/components/MenuWrapper/MenuWrapper'
import { PopUpWrapper } from '@/components/PopUpWrapper'
import { ResultsPageQueries } from '@/components/_results/types'
import { PopUpMessage } from '@/contexts/PopUpContext'
import { SessionContext } from '@/contexts/SessionContext'
import { useMountlessEffect } from '@/hooks/useMountlessEffect'
import { API } from '@/misc/API'
import { Constants } from '@/misc/Constants'
import { Paths } from '@/misc/Paths'
import { Storage } from '@/misc/Storage'
import { Theme } from '@/misc/Theme'
import '@/styles/globals.css'
import { Answer, TestStatus } from '@/types/SQLTypes'
import { MenuOption, ProgressStatus } from '@/types/misc'
import { UserProvider } from '@auth0/nextjs-auth0/client'
import { ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [loadingOverlay, setLoadingOverlay] = useState(false)
  const [message, setMessage] = useState<PopUpMessage | undefined>(undefined)
  const [testToken, setTestToken] = useState<string | undefined>(undefined)
  const [status, setStatus] = useState<ProgressStatus>('not_checked_token')
  const [savedProgress, setSavedProgress] = useState<Answer[] | undefined>(undefined)
  const router = useRouter()

  const logOutOption: MenuOption = {
    onClick: () => {
      setTestToken(undefined)
      setSavedProgress(undefined)
      Storage.clearToken()
      router.push('/api/auth/logout')
    },
    title: 'Log Out/Retake Test',
    disabled: router.pathname === Paths.home,
  }

  useEffect(() => {
    router.events.on('routeChangeStart', () => setLoadingOverlay(true))
    router.events.on('routeChangeComplete', () => setLoadingOverlay(false))
  }, [])

  useEffect(() => {
    if (router.pathname === Paths.admin) {
      return
    }
    if (status === 'not_checked_token') {
      const token = Storage.getToken()
      if (token) {
        setTestToken(token)
        setStatus('has_token_will_attempt_resume')
      } else {
        setStatus('does_not_have_token')
      }
    }
  }, [status, router.pathname])

  useMountlessEffect(() => {
    if (status === 'has_token_will_attempt_resume') {
      setLoadingOverlay(true)
      API.getTestAnswers({ id: testToken as string })
        .then((res) => {
          if (res.err) {
            setStatus('could_not_restore_progress')
            Storage.clearToken()
            setTestToken(undefined)
          } else {
            setSavedProgress(res.res?.answers)
            setStatus('successfully_restored_progress')
            res.res?.status === TestStatus.Finished
              ? router.push(`${Paths.results}?${ResultsPageQueries.resultsInState}=${Constants.TRUE()}`)
              : router.push(Paths.test)
          }
        })
        .finally(() => {
          setLoadingOverlay(false)
        })
    }
  }, [status])

  return (
    <ThemeProvider theme={Theme}>
      <UserProvider>
        <SessionContext.Provider value={{ setTestToken, testToken, savedProgress, status, setSavedProgress }}>
          <LoadingOverlayWrapper on={loadingOverlay} toggle={setLoadingOverlay}>
            <MenuWrapper options={[logOutOption]}>
              <PopUpWrapper clearMessage={() => setMessage(undefined)} pushPopUpMessage={(msg) => setMessage(msg)} popUpMessage={message}>
                <Component {...pageProps} />
              </PopUpWrapper>
            </MenuWrapper>
          </LoadingOverlayWrapper>
        </SessionContext.Provider>
      </UserProvider>
    </ThemeProvider>
  )
}
