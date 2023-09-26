import { Head } from '@/components/Head'
import { LoadingOverlay } from '@/components/LoadingOverlay/LoadingOverlay'
import { MainWrapper } from '@/components/MainWrapper'
import { ScoreNode } from '@/components/ScoreNode'
import { ResultsUtils } from '@/components/_results/misc'
import { PopUpContext } from '@/contexts/PopUpContext'
import { useResizeObserver } from '@/hooks/useResizeObserver'
import { Convert } from '@/misc/Convert'
import { Paths } from '@/misc/Paths'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { Utils } from '@/misc/Utils'
import { Question, SQLQuestion, SQLTest, SQLTestAndNickname, TestAndNickname } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import { UserContext } from '@auth0/nextjs-auth0/client'
import { Box, Button, Typography, useMediaQuery } from '@mui/material'
import { db } from '@vercel/postgres'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useContext, useRef, useState } from 'react'

const DEFAULT_RESULT_CONTAINER_HEIGHT = 400

type Props = {
  questionsRes: APIRes<Partial<Question>[]>
  testRes: APIRes<Partial<TestAndNickname> | null>
}

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
  const questionPromise = SQL.query<SQLQuestion>(client, SQLQueries.getQuestions)
  const testID = context?.params?.id as string
  const testPromise: Promise<APIRes<SQLTestAndNickname[]>> = SQL.query<SQLTestAndNickname>(
    client,
    SQLQueries.getTestAndNicknameByID(testID as string),
  )
  const [questionsRes, testRes] = await Promise.all([questionPromise, testPromise])
  client.release()
  if (questionsRes.res === undefined) {
    console.log(questionsRes)
  }
  const test = testRes?.res?.length ? Convert.sqlToTestAndNickname(testRes.res[0]) : null
  const convertedQuestions = questionsRes.res?.map(Convert.sqlToQuestion) || []
  return {
    props: {
      testRes: { err: !!testRes?.err, res: test, message: testRes?.message || null },
      questionsRes: { ...questionsRes, res: convertedQuestions },
    },
  }
}

export default function Results({ questionsRes, testRes }: Props) {
  const router = useRouter()
  const [resultContainerHeight, setResultContainerHeight] = useState(DEFAULT_RESULT_CONTAINER_HEIGHT)
  const { push, isFallback } = useRouter()
  const { user } = useContext(UserContext)
  const { pushPopUpMessage } = useContext(PopUpContext)
  const resultContainerRef = useRef<HTMLDivElement>(null)
  const hideStickyButtonShowStatic = useMediaQuery('@media (min-width: 620px)')
  const test = testRes.res
  const answers = test?.answers || []
  const questions = questionsRes.res || []
  const scores = ResultsUtils.deriveCompatibleCognitiveScores(questions, answers)

  const matches = ResultsUtils.deriveCompatibilityVectors(scores)
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

  useResizeObserver(resultContainerRef, () => {
    setResultContainerHeight(resultContainerRef.current?.clientHeight || DEFAULT_RESULT_CONTAINER_HEIGHT)
  })
  return (
    <>
      <Head />
      <MainWrapper>
        <LoadingOverlay loading={isFallback} />
        <Typography variant="h3" style={{ textAlign: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 30 }}>
          {getHeader()}
        </Typography>
        {!isFallback &&
          (!!answers.length ? (
            <>
              <Typography variant="body1" style={{ textAlign: 'center', padding: '10px 20px 5px 20px' }}>
                {`Here are your results! Also included, is how closely your romantic preference for each individual cognitive functions aligns with each MBTI's preference`}
              </Typography>
              {!hideStickyButtonShowStatic && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                  <Button variant="contained" style={{ marginTop: 20 }} onClick={onButtonClick}>
                    {buttonText}
                  </Button>
                </div>
              )}
              <div style={{ display: 'flex' }} ref={resultContainerRef}>
                <Box
                  sx={{
                    width: 600,
                    '@media (max-width: 820px)': {
                      width: 400,
                    },
                    '@media (max-width: 430px)': {
                      width: '100%',
                    },
                  }}
                >
                  {...matches
                    .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
                    .map((match, i) => <ScoreNode match={match} key={match.key} index={i} />)}
                </Box>
                {hideStickyButtonShowStatic && (
                  <div style={{ height: resultContainerHeight }}>
                    <div style={{ position: 'sticky', top: 60, right: 20, marginTop: 20 }}>
                      <Button variant="contained" onClick={onButtonClick}>
                        {buttonText}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ height: 40 }} />
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
