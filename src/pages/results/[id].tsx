import { Head } from '@/components/Head'
import { MainWrapper } from '@/components/MainWrapper'
import { PopUpContext } from '@/contexts/PopUpContext'
import { useResizeObserver } from '@/hooks/useResizeObserver'
import { Convert } from '@/misc/Convert'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { Question, SQLQuestion, SQLTest, SQLTestAndNickname, TestAndNickname } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import { UserContext } from '@auth0/nextjs-auth0/client'
import { useMediaQuery } from '@mui/material'
import { db } from '@vercel/postgres'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import { useContext, useRef, useState } from 'react'

const DEFAULT_RESULT_CONTAINER_HEIGHT = 400

type Props = {
  questionsRes: APIRes<Partial<Question>[]>
  testRes: APIRes<Partial<TestAndNickname> | null>
  testProp: string
}

export const getStaticPaths: GetStaticPaths = async () => {
  const client = await db.connect()
  const res = await SQL.query<Partial<SQLTest>>(client, SQLQueries.getAllTestIDs)
  const paths = res.res?.map((node) => ({ params: { id: node.id || '' } })) || []
  console.log(paths)
  client.release()
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  try {
    const client = await db.connect()
    const questionPromise = SQL.query<SQLQuestion>(client, SQLQueries.getQuestions)
    const testID = context?.params?.id as string
    const testPromise: Promise<APIRes<SQLTestAndNickname[]>> = SQL.query<SQLTestAndNickname>(
      client,
      SQLQueries.getTestAndNicknameByID(testID as string),
    )
    const [questionsRes, testRes] = await Promise.all([questionPromise, testPromise])
    client.release()
    const test = testRes?.res?.length ? Convert.sqlToTestAndNickname(testRes.res[0]) : null
    const convertedQuestions = questionsRes.res?.map(Convert.sqlToQuestion) || []
  } catch (e) {
    console.log('ERROR')
    console.log(e)
  }
  return {
    props: {
      testRes: { err: true, message: null },
      questionsRes: { err: true, message: null },
      testProp: 'TEST',
    },
  }
}

export default function Results({ questionsRes, testRes, testProp }: Props) {
  const router = useRouter()
  const [resultContainerHeight, setResultContainerHeight] = useState(DEFAULT_RESULT_CONTAINER_HEIGHT)
  const { push, isFallback } = useRouter()
  const { user } = useContext(UserContext)
  const { pushPopUpMessage } = useContext(PopUpContext)
  const resultContainerRef = useRef<HTMLDivElement>(null)
  const hideStickyButtonShowStatic = useMediaQuery('@media (min-width: 620px)')
  useResizeObserver(resultContainerRef, () => {
    setResultContainerHeight(resultContainerRef.current?.clientHeight || DEFAULT_RESULT_CONTAINER_HEIGHT)
  })
  return (
    <>
      <Head />
      <MainWrapper>hello</MainWrapper>
    </>
  )
}
