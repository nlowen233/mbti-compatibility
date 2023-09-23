import Head from 'next/head'
import { useTheme, Typography, Box, Button } from '@mui/material'
import { MainWrapper } from '@/components/MainWrapper'
import { useReducer } from 'react'
import { IndexPageReducer } from '../components/_index/reducer'
import { UserContext } from '@auth0/nextjs-auth0/client'
import { FormSelect } from '@/components/FormSelect'
import { Constants } from '@/misc/Constants'
import { useContext, useEffect } from 'react'
import { Convert } from '@/misc/Convert'
import { useRouter } from 'next/router'
import { IndexPageQueryDictionary } from '../components/_index/types'
import { API } from '@/misc/API'
import { SessionContext } from '@/contexts/SessionContext'
import { PopUpContext } from '@/contexts/PopUpContext'
import { Storage } from '@/misc/Storage'

export default function Home() {
  const router = useRouter()
  const { palette } = useTheme()
  const { user } = useContext(UserContext)
  const {setTestToken} = useContext(SessionContext)
  const {pushPopUpMessage} = useContext(PopUpContext)
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
    const testRes = await API.loginStartTest({ ...state, ...user })
    if(testRes.err){
      pushPopUpMessage({message:testRes.message||Constants.unknownError,title:'Could not start test',type:'error'})
    } else{
      const token = testRes.res?.id as string
      setTestToken(token)
      Storage.storeToken(token)
      router.push('/test')
    }
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

  return (
    <>
      <Head>
        <title>MBTI Compatibility</title>
        <meta name="Find your MBTI match" content="Home screen, find who you are compatible with" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
              <FormSelect onChange={onChangeMBTI} value={state.mbtiType} label="Your presumed MBTI" options={Constants.MBTIs()} />
              <FormSelect
                onChange={onChangeExpected}
                value={state.expectedResult}
                label="Your expected most compatible MBTI"
                options={Constants.MBTIs()}
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
