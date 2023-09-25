import { Head } from '@/components/Head'
import { MainWrapper } from '@/components/MainWrapper'
import { ScoreNode } from '@/components/ScoreNode'
import { ResultsUtils } from '@/components/_results/misc'
import { ResultsFromStateStatus, ResultsPageQueryDictionary } from '@/components/_results/types'
import { SessionContext } from '@/contexts/SessionContext'
import { Constants } from '@/misc/Constants'
import { Convert } from '@/misc/Convert'
import { Paths } from '@/misc/Paths'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { Utils } from '@/misc/Utils'
import { Answer, Question, SQLQuestion, SQLTest, Test } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import { getSession } from '@auth0/nextjs-auth0'
import { Button, Typography } from '@mui/material'
import { db } from '@vercel/postgres'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useContext, useEffect, useState } from 'react'

const NO_TEST_ID = 'No testId in the query'
const TEST_RESULTS_IN_STATE = 'Will get test results from state'

type Props = {
  questionsRes: APIRes<Partial<Question>[]>
  testRes: APIRes<Partial<Test> | null>
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const client = await db.connect()
  const questionPromise = SQL.query<SQLQuestion>(client, SQLQueries.getQuestions)
  const SHOULD_REDIRECT = 'ERROR-SHOULD-REDIRECT'
  const testPromise = new Promise<APIRes<SQLTest[]>>((res) => {
    const { testId, resultsInState } = context.query as ResultsPageQueryDictionary
    if (!testId) {
      res({ err: true, message: NO_TEST_ID })
    } else if (resultsInState === Constants.TRUE()) {
      res({ err: true, message: TEST_RESULTS_IN_STATE })
    } else {
      getSession(context.req, context.res)
        .then((session) => {
          if (Utils.isAdmin(session?.user)) {
            SQL.query<SQLTest>(client, SQLQueries.getTestByID(testId as string)).then(res)
          } else {
            const userId = session?.user.sub
            SQL.query<SQLTest>(client, SQLQueries.getTestByUserAndID(testId as string, userId)).then(res)
          }
        })
        .catch(() => res({ err: true, message: SHOULD_REDIRECT }))
    }
  })
  const [questionsRes, testRes] = await Promise.all([questionPromise, testPromise])
  client.release()
  if (testRes.message === SHOULD_REDIRECT) {
    return {
      redirect: {
        destination: '/api/auth/login',
        permanent: false,
      },
    }
  }
  const test = testRes.res?.length ? Convert.sqlToTest(testRes.res[0]) : null
  const convertedQuestions = questionsRes.res?.map(Convert.sqlToQuestion) || []
  return {
    props: {
      testRes: { ...testRes, res: test },
      questionsRes: { ...questionsRes, res: convertedQuestions },
    },
  }
}

export default function Results({ questionsRes, testRes }: Props) {
  const router = useRouter()
  const { savedProgress, status } = useContext(SessionContext)
  const [gotAnswersFromState, setGotAnswersFromState] = useState<ResultsFromStateStatus>('not_checked')
  const [stateAnswers, setStateAnswers] = useState<Answer[] | null>(null)
  const { resultsInState } = router.query as ResultsPageQueryDictionary
  const test = testRes.res
  const getTestAnswers = () => {
    if (stateAnswers?.length && gotAnswersFromState) {
      return stateAnswers
    }
    return test?.answers || []
  }
  const answers = getTestAnswers()
  const questions = questionsRes.res || []
  const scores = ResultsUtils.deriveCompatibleCognitiveScores(questions, answers)
  const matches = ResultsUtils.deriveCompatibilityVectors(scores)
  console.log(scores, matches)
  useEffect(() => {
    if (resultsInState === Constants.TRUE() && savedProgress && gotAnswersFromState === 'not_checked') {
      setStateAnswers(savedProgress)
      setGotAnswersFromState('got_answers_from_state')
    }
  }, [resultsInState, gotAnswersFromState, savedProgress])

  return (
    <>
      <Head />
      <MainWrapper>
        <Typography variant="h3" style={{ textAlign: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 30 }}>
          Results
        </Typography>
        {!!answers.length && (
          <Typography variant="body1" style={{ textAlign: 'center', paddingLeft: 20, paddingRight: 20, paddingTop: 10 }}>
            {`Here are your results! Also included, is how closely your preference for individual cognitive functions align with each MBTI's preference`}
          </Typography>
        )}
        {!!answers.length ? (
          [...matches]
            .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
            .map((match, i) => <ScoreNode match={match} key={match.key} index={i} />)
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: 300 }}>
            <Typography variant="h5" style={{ textAlign: 'center', padding: 20 }}>
              Could not find your results...
            </Typography>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
          <Button variant="contained" onClick={() => router.push(Paths.home)}>
            Retake the Test
          </Button>
        </div>
        <div style={{ height: 40 }} />
      </MainWrapper>
    </>
  )
}
