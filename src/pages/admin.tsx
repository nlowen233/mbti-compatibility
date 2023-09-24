import { CustomizableQuestion } from '@/components/CustomizableQuestion'
import { MainWrapper } from '@/components/MainWrapper'
import { AdminUtils } from '@/components/_admin/misc'
import { AdminPageReducer } from '@/components/_admin/reducer'
import { AdminPageAction } from '@/components/_admin/types'
import { LoadingOverlayContext } from '@/contexts/LoadingOverlayContext'
import { Constants } from '@/misc/Constants'
import { Convert } from '@/misc/Convert'
import { Roles } from '@/misc/Roles'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { Styles } from '@/misc/Styles'
import { ZIndex } from '@/misc/ZIndex'
import { Question, SQLQuestion, Scores } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import { getSession } from '@auth0/nextjs-auth0'
import { UserContext } from '@auth0/nextjs-auth0/client'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Box, Button, IconButton, Input, Typography, useTheme } from '@mui/material'
import { db } from '@vercel/postgres'
import _ from 'lodash'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useContext, useEffect, useReducer, useState } from 'react'

type Props = APIRes<SQLQuestion[]>

const grid = Styles.functionGrid()

export const getServerSideProps: GetServerSideProps<{}> = async ({ req, res }) => {
  const session = await getSession(req, res)
  const roles = session?.user[Constants.rolesNamespace] as string[] | undefined
  if (!roles?.includes(Roles.admin)) {
    return {
      redirect: {
        destination: '/404',
        permanent: false,
      },
    }
  }
  const client = await db.connect()
  const sqlRes = await SQL.query<SQLQuestion>(client, SQLQueries.getQuestions)
  client.release()
  return {
    props: sqlRes,
  }
}

export default function Admin({ err, message, res }: Props) {
  const router = useRouter()
  const { user, isLoading } = useContext(UserContext)
  const { palette } = useTheme()
  const [pageSize, setPageSize] = useState(8)
  const [page, setPage] = useState(0)
  const [pageSizeInput, setPageSizeInput] = useState(`${pageSize}`)
  const loading = useContext(LoadingOverlayContext)

  const [state, dispatch] = useReducer(
    AdminPageReducer.reducer,
    AdminPageReducer.INIT_STATE(res?.map(Convert.sqlToQuestion) as Question[] | undefined),
  )

  const paginatedQuestions = Array.from(
    { length: Math.ceil((state.questions?.length || 0) / pageSize) },
    (_, index) => state.questions?.slice(index * pageSize, index * pageSize + pageSize),
  )

  const currentQuestions = paginatedQuestions[page]
  const functionTotals = AdminUtils.getAllFunctionTotals(state.questions)
  const [average, workingAverage] = AdminUtils.getAverageFunctionKey(functionTotals)
  const submitDisabled = _.isEqual(state.questions, state.cachedQuestions) || AdminUtils.allScoresAreEqual(functionTotals)

  const onChangeQuestionScore = ({ id, scoreKey, scoreValue }: Partial<AdminPageAction>) =>
    dispatch({ type: 'changeQuestionScore', id, scoreKey, scoreValue })
  const onChangeQuestionText = ({ id, text }: Partial<AdminPageAction>) => dispatch({ type: 'changeQuestionText', id, text })
  const onChangePage = (n: number) => {
    if (!Number.isInteger(n)) {
      return
    }
    if (n >= paginatedQuestions.length) {
      return
    }
    if (n < 0) {
      return
    }
    setPage(n)
  }
  const onCommitPageSize = () => {
    const numerical = Number(pageSizeInput)
    if (!Number.isInteger(numerical) || numerical > state.questions.length || numerical < 1) {
      return setPageSizeInput(`${pageSize}`)
    }
    setPageSize(numerical)
  }

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/api/auth/login?returnTo=/admin')
    }
  }, [user, isLoading])

  return (
    <>
      <Head>
        <title>MBTI Compatibility Admin</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MainWrapper>
        <div style={{ backgroundColor: palette.background.default }}>
          <Typography variant="h3" style={{ padding: 20 }}>
            Admin Controls
          </Typography>
          {currentQuestions.map((q, i) => (
            <CustomizableQuestion
              question={q}
              key={q.id}
              onChangeScore={(scoreKey, scoreValue) => onChangeQuestionScore({ id: q.id, scoreKey, scoreValue })}
              onChangeText={(text) => onChangeQuestionText({ id: q.id, text })}
              style={{ marginBottom: 40 }}
              serverDifference={
                !_.isEqual(
                  q,
                  state.cachedQuestions.find((k) => k.id === q.id),
                )
              }
            />
          ))}
        </div>
        <div style={{ height: 300 }} />
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'white',
            zIndex: ZIndex.adminMenu,
            padding: 10,
          }}
        >
          <Box
            sx={{
              ...grid,
              paddingTop: 1,
              paddingBottom: 1,
            }}
          >
            {Object.keys(functionTotals).map((func) => {
              const score = functionTotals[func as keyof Scores]
              return (
                <div key={func} style={{ display: 'flex' }}>
                  <Typography variant="h5" style={{ paddingRight: 10 }}>
                    {func}
                  </Typography>
                  <Typography variant="h5" style={{ color: AdminUtils.deriveScoreColor(workingAverage, score) }}>
                    {score}
                  </Typography>
                </div>
              )
            })}
          </Box>
          <div style={{ width: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex' }}>
            <IconButton onClick={() => onChangePage(page - 1)}>
              <ArrowBackIosIcon />
            </IconButton>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" style={{ paddingRight: 10 }}>
                Page:
              </Typography>
              <Input style={{ width: 20 }} value={page} onChange={(e) => onChangePage(Number(e.target.value))} />
            </div>
            <IconButton onClick={() => onChangePage(page + 1)}>
              <ArrowForwardIosIcon />
            </IconButton>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" style={{ paddingRight: 10 }}>
                Page Size:
              </Typography>
              <Input
                style={{ width: 20 }}
                value={pageSizeInput}
                onChange={(e) => setPageSizeInput(e.target.value)}
                onBlur={onCommitPageSize}
              />
            </div>
            <Button variant="contained" style={{ marginLeft: 10 }} disabled={submitDisabled}>
              Save Changes
            </Button>
          </div>
        </div>
      </MainWrapper>
    </>
  )
}
