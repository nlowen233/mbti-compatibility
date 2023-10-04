import { Head } from '@/components/Head'
import { MainWrapper } from '@/components/MainWrapper'
import { ProgressBar } from '@/components/ProgressBar'
import { SelectableQuestion } from '@/components/SelectableQuestion'
import { ResultsUtils } from '@/components/_results/misc'
import { TestPageUtils } from '@/components/_test/misc'
import { TestPageReducer } from '@/components/_test/reducer'
import { LoadingOverlayContext } from '@/contexts/LoadingOverlayContext'
import { PopUpContext } from '@/contexts/PopUpContext'
import { SessionContext } from '@/contexts/SessionContext'
import { useMountlessEffect } from '@/hooks/useMountlessEffect'
import { API } from '@/misc/API'
import { Constants } from '@/misc/Constants'
import { Convert } from '@/misc/Convert'
import { Paths } from '@/misc/Paths'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { Storage } from '@/misc/Storage'
import { Question, SQLQuestion, TestStatus } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import { Box, Button, Typography } from '@mui/material'
import { db } from '@vercel/postgres'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useContext, useEffect, useReducer, useState } from 'react'
import { animateScroll } from 'react-scroll'
import { WritingProgressState } from './api/tests/types'

const PAGINATE_ON = 10

type Props = APIRes<Partial<Question>[]>

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const client = await db.connect()
  const sqlRes = await SQL.query<SQLQuestion>(client, SQLQueries.getQuestions)
  client.release()
  return {
    props: { ...sqlRes, res: sqlRes.res?.map(Convert.sqlToQuestion) || [] },
  }
}

export default function Test({ err, message, res }: Props) {
  const router = useRouter()
  const [state, dispatch] = useReducer(TestPageReducer.reducer, TestPageReducer.INIT_STATE())
  const [page, setPage] = useState(0)
  const [writingProgressState, setWritingProgressState] = useState<WritingProgressState>('no_need_to_check')
  const [isLoading, setIsLoading] = useState(false)
  const { testToken, savedProgress } = useContext(SessionContext)
  const { status } = useContext(SessionContext)
  const { pushPopUpMessage } = useContext(PopUpContext)
  const { toggle } = useContext(LoadingOverlayContext)

  const questions = res
  const paginatedQuestions = Array.from(
    { length: Math.ceil((questions?.length || 0) / PAGINATE_ON) },
    (_, index) => questions?.slice(index * PAGINATE_ON, index * PAGINATE_ON + PAGINATE_ON),
  ) as Partial<Question>[][]

  const currentQuestions = paginatedQuestions[page]
  const goBackDisabled = page === 0
  const nextDisabled = isLoading || currentQuestions?.some((q) => !state.answers.find((a) => a.id === q.id))
  const isFinalPage = page === paginatedQuestions.length - 1

  const onScoreQuestion = (id: string, score: number) => dispatch({ id, score, type: 'updateAnswer' })

  const onContinue = async () => {
    setIsLoading(true)
    const res = await API.updateTest({ answers: state.answers, id: testToken, status: TestStatus.InProgress })
    setIsLoading(false)
    if (res.err) {
      pushPopUpMessage({ message: res.message || Constants.unknownError, title: 'Error saving your progress', type: 'error' })
    } else {
      setPage((p) => p + 1)
      animateScroll.scrollToTop()
    }
  }

  const onFinish = async () => {
    setIsLoading(true)
    const functionScores = ResultsUtils.deriveCompatibleCognitiveScores(questions || [], state.answers)
    const results = ResultsUtils.deriveCompatibilityVectors(functionScores)
    const res = await API.updateTest({ answers: state.answers, id: testToken, status: TestStatus.Finished, functionScores, results })
    setIsLoading(false)
    if (res.err) {
      pushPopUpMessage({ message: res.message || Constants.unknownError, title: 'Error finalizing your test', type: 'error' })
    } else {
      Storage.clearToken()
      router.push(`${Paths.results}/${testToken}`)
    }
  }

  const onGoBack = () => {
    setPage((p) => p - 1)
    animateScroll.scrollToTop()
  }

  useEffect(() => {
    if (!testToken && status !== 'not_checked_token') {
      router.push(Paths.home)
    }
  }, [testToken, status])

  useEffect(() => {
    if (status === 'successfully_restored_progress') {
      setWritingProgressState('checking')
    }
  }, [status])

  useMountlessEffect(() => {
    if (writingProgressState === 'checking') {
      dispatch({ type: 'setAnswers', answers: savedProgress })
      setWritingProgressState('dispatched_to_store')
    }
  }, [writingProgressState])

  useMountlessEffect(() => {
    if (writingProgressState === 'dispatched_to_store') {
      setPage(TestPageUtils.getReturnToPage(paginatedQuestions, state.answers))
      setWritingProgressState('changed_page_to_match_progress')
    }
  }, [writingProgressState])

  useMountlessEffect(() => {
    isLoading ? toggle(true) : toggle(false)
  }, [isLoading])

  return (
    <>
      <Head />
      <MainWrapper>
        <Typography variant="h3" style={{ textAlign: 'center', padding: 20 }}>
          MBTI Compatibility Test
        </Typography>
        {currentQuestions?.map((q, i) => (
          <SelectableQuestion
            onSelectScore={(score) => onScoreQuestion(q.id as string, score)}
            key={q.id}
            question={q}
            score={state.answers.find((a) => a.id === q.id)?.score}
            questionIndex={i + 1 + page * PAGINATE_ON}
            style={{
              paddingBottom: 20,
              minWidth: 200,
            }}
          />
        ))}
        <div style={{ height: 80 }} />
        <Box
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            backgroundColor: 'white',
            width: '100%',
            transition: '250ms',
          }}
          sx={{
            opacity: 0.8,
            ':hover': {
              opacity: 1,
            },
          }}
        >
          <ProgressBar step={page + 1} numberSteps={paginatedQuestions.length} />
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <Button onClick={onGoBack} disabled={goBackDisabled}>
              <Typography variant="h5">Go Back</Typography>
            </Button>
            <Button onClick={isFinalPage ? onFinish : onContinue} disabled={nextDisabled}>
              <Typography variant="h5">{isFinalPage ? 'Finish' : 'Next'}</Typography>
            </Button>
          </div>
        </Box>
      </MainWrapper>
    </>
  )
}
