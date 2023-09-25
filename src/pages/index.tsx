import { FormSelect } from '@/components/FormSelect'
import { Head } from '@/components/Head'
import { MainWrapper } from '@/components/MainWrapper'
import { LoadingOverlayContext } from '@/contexts/LoadingOverlayContext'
import { PopUpContext } from '@/contexts/PopUpContext'
import { SessionContext } from '@/contexts/SessionContext'
import { useMountlessEffect } from '@/hooks/useMountlessEffect'
import { API } from '@/misc/API'
import { Constants } from '@/misc/Constants'
import { Convert } from '@/misc/Convert'
import { Paths } from '@/misc/Paths'
import { Storage } from '@/misc/Storage'
import { UserContext } from '@auth0/nextjs-auth0/client'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useEffect, useReducer, useState } from 'react'
import { IndexPageReducer } from '../components/_index/reducer'
import { IndexPageQueryDictionary } from '../components/_index/types'

export default function Home() {
  const router = useRouter()
  const { palette } = useTheme()
  const { user } = useContext(UserContext)
  const { setTestToken, setSavedProgress } = useContext(SessionContext)
  const { pushPopUpMessage } = useContext(PopUpContext)
  const { toggle } = useContext(LoadingOverlayContext)
  const [isCreatingTest, setIsCreatingTest] = useState(false)
  const [state, dispatch] = useReducer(IndexPageReducer.reducer, IndexPageReducer.INIT_STATE())
  const query = router.query as IndexPageQueryDictionary
  const buttonDisabled = !state.age || !state.expectedResult || !state.gender || !state.mbtiType
  const buttonText = !!user ? 'Take the Test!' : 'Get Verified'
  const redirectURL = `/api/auth/login?returnTo=?${Convert.indexStateToQueryParams(state)}`

  const onChangeAge = (age: string | undefined) => dispatch({ type: 'setage', age })
  const onChangeGender = (gender: string | undefined) => dispatch({ type: 'setgender', gender })
  const onChangeMBTI = (mbtiType: string | undefined) => dispatch({ type: 'setmbtiType', mbtiType })
  const onChangeExpected = (expectedResult: string | undefined) => dispatch({ type: 'setexpectedResult', expectedResult })

  const onStartTest = async () => {
    setIsCreatingTest(true)
    const testRes = await API.loginStartTest({ ...state, ...user })
    setIsCreatingTest(false)
    if (testRes.err) {
      return pushPopUpMessage({ message: testRes.message || Constants.unknownError, title: 'Could not start test', type: 'error' })
    }
    const testToken = testRes.res?.id
    if (!testToken) {
      return pushPopUpMessage({ message: 'Server failed to return test token', title: 'Could not start test', type: 'error' })
    }
    if (testRes.err) {
      return pushPopUpMessage({ message: testRes.message || Constants.unknownError, title: 'Could not start test', type: 'error' })
    }
    setTestToken(testToken)
    setSavedProgress(testRes.res?.answers)
    Storage.storeToken(testToken)
    router.push(Paths.test)
  }

  useEffect(() => {
    const { age, expected, gender, mbti } = query
    if (age) {
      dispatch({ type: 'setage', age })
    }
    if (expected) {
      dispatch({ type: 'setexpectedResult', expectedResult: expected })
    }
    if (mbti) {
      dispatch({ type: 'setmbtiType', mbtiType: mbti })
    }
    if (gender) {
      dispatch({ type: 'setgender', gender })
    }
  }, [query])

  useMountlessEffect(() => {
    isCreatingTest ? toggle(true) : toggle(false)
  }, [isCreatingTest])

  return (
    <>
      <Head />
      <MainWrapper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: palette.background.default,
            overflowX: 'auto',
          }}
        >
          <div style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Typography variant="h1" textAlign={'center'}>
              MBTI Compatibility Test
            </Typography>
            <Typography variant="h4" textAlign={'center'}>
              By an ENTJ
            </Typography>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 5,
                columnGap: 5,
                gridTemplateColumns: '1fr 1fr',
                width: '80%',

                '@media (max-width: 870px)': {
                  gridTemplateColumns: '1fr',
                },
              }}
            >
              <FormSelect onChange={onChangeAge} value={state.age} label="Age" options={Constants.Ages()} />
              <FormSelect onChange={onChangeGender} value={state.gender} label="Gender" options={Constants.Genders()} />
              <FormSelect onChange={onChangeMBTI} value={state.mbtiType} label="Your presumed MBTI" options={Constants.MBTIOptions()} />
              <FormSelect
                onChange={onChangeExpected}
                value={state.expectedResult}
                label="Your expected most compatible MBTI"
                options={Constants.MBTIOptions()}
              />
            </Box>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 20, flexDirection: 'column' }}>
            <Button
              variant="contained"
              disabled={buttonDisabled}
              href={!!user ? undefined : redirectURL}
              onClick={!!user ? onStartTest : undefined}
            >
              {buttonText}
            </Button>
            <Typography variant="body1" textAlign={'center'} style={{ paddingTop: 10, paddingRight: 20, paddingLeft: 20 }}>
              {`*By getting verified, you acknowledge that your test outcomes may be anonymously included in survey data. You also consent to your data being used to tailor potential future services offered.`}
            </Typography>
          </div>
          <div style={{ paddingBottom: 20 }} />
        </div>
      </MainWrapper>
    </>
  )
}
