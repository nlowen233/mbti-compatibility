import { Head } from '@/components/Head'
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay'
import { MainWrapper } from '@/components/MainWrapper'
import { ResultsView } from '@/components/_results/ResultsView'
import { PopUpContext } from '@/contexts/PopUpContext'
import { Convert } from '@/misc/Convert'
import { Paths } from '@/misc/Paths'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { Utils } from '@/misc/Utils'
import { SQLTest, SQLTestAndNickname } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import { UserContext } from '@auth0/nextjs-auth0/client'
import { Button, Typography } from '@mui/material'
import { db } from '@vercel/postgres'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useContext } from 'react'

type Props = APIRes<Partial<SQLTestAndNickname> | null>

export const getStaticPaths: GetStaticPaths = async () => {
  const client = await db.connect()
  const res = await SQL.query<Partial<SQLTest>>(client, SQLQueries.getAllTestIDs)
  const paths = res.res?.map((node) => ({ params: { id: node.id || '' } })) || []
  client.release()
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const client = await db.connect()
  const testID = context?.params?.id as string
  const testRes: APIRes<SQLTestAndNickname[]> = await SQL.query<SQLTestAndNickname>(
    client,
    SQLQueries.getTestAndNicknameByID(testID as string),
  )
  client.release()
  const test = testRes.res?.length ? testRes.res[0] : null
  return {
    props: { err: !!testRes?.err, res: test, message: testRes?.message || null },
  }
}

export default function Results(props: Partial<Props>) {
  const router = useRouter()
  const { push, isFallback } = useRouter()
  const { user } = useContext(UserContext)
  const { pushPopUpMessage } = useContext(PopUpContext)
  const test = props.res ? Convert.sqlToTestAndNickname(props.res) : undefined
  const answers = test?.answers || []

  const getHeader = () => {
    if (isFallback) {
      return `Hang on while we get your results ready...`
    }
    if (!answers.length) {
      return ``
    }
    return !!test?.nickName ? `${test.nickName}'s Results` : `Your Results`
  }

  const onButtonClick = async () => {
    if (test?.userId !== user?.sub) {
      return router.push(Paths.home)
    }
    if (!test?.id) {
      return pushPopUpMessage({ title: 'Could not find your test ID', message: 'Share failed', type: 'error' })
    }
    Utils.shareResults(test.id)
  }

  const buttonText = test?.userId === user?.sub ? 'Share your results' : 'Take the test!'

  return (
    <>
      <Head
        title={`${test?.nickName}'s Compatibility Results`}
        description={`Check out the rankings and summary of ${test?.nickName}'s MBTI compatibility results`}
      />
      <MainWrapper>
        <LoadingOverlay loading={isFallback} />
        <Typography variant="h3" style={{ textAlign: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 30 }}>
          {getHeader()}
        </Typography>
        {!isFallback &&
          (!!answers.length ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                <Button variant="contained" style={{ marginTop: 20 }} onClick={onButtonClick}>
                  {buttonText}
                </Button>
              </div>
              <ResultsView nodes={test?.results || []} summary={test?.gptResponse} />
            </>
          ) : (
            <div
              style={{
                height: '90vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                minHeight: 600,
              }}
            >
              <Typography variant="h2" style={{ textAlign: 'center', paddingLeft: 40, paddingRight: 40, paddingTop: 10 }}>
                {`We can't find any record of this test... sorry!`}
              </Typography>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                <Button variant="contained" onClick={() => push(Paths.home)}>
                  {`I'll take you home`}
                </Button>
              </div>
            </div>
          ))}
      </MainWrapper>
    </>
  )
}
