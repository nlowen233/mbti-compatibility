import { Head } from '@/components/Head'
import { MainWrapper } from '@/components/MainWrapper'
import { TestNode } from '@/components/_tests/TestNode'
import { TestsPageUtils } from '@/components/_tests/misc'
import { SQLTestWithQuestions } from '@/components/_tests/types'
import { Paths } from '@/misc/Paths'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { TestStatus } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import { getSession } from '@auth0/nextjs-auth0'
import { Box, Typography, useMediaQuery } from '@mui/material'
import { db } from '@vercel/postgres'
import dayjs from 'dayjs'
import { GetServerSideProps } from 'next'

type Props = APIRes<SQLTestWithQuestions[]>

export const getServerSideProps: GetServerSideProps<{}> = async ({ req, res }) => {
  const session = await getSession(req, res)
  const id = session?.user.sub as string | undefined
  if (!id) {
    return {
      redirect: {
        destination: Paths.home,
        permanent: false,
      },
    }
  }
  const client = await db.connect()
  const sqlRes = await SQL.query<SQLTestWithQuestions[]>(client, SQLQueries.getAllTestsForUserID(id))
  client.release()
  return {
    props: sqlRes,
  }
}

export default function AllTests({ err, message, res }: Props) {
  const [tests, amountOfQuestions] = TestsPageUtils.convertSqlTestAndQuestionNum(res || [])
  const isMobile = useMediaQuery('@media (max-width: 1070px)')
  const sortedTests = [...tests].sort((a, b) => {
    if (a.status !== TestStatus.Finished && b.status === TestStatus.Finished) {
      return -1
    }
    if (dayjs(a.createdAt).isAfter(b.createdAt)) {
      return -1
    } else {
      return 1
    }
  })
  return (
    <>
      <Head />
      <MainWrapper>
        <Box
          sx={{
            padding: 2,
          }}
        >
          <Typography variant="h2" style={{ paddingBottom: 10, paddingTop: 20 }}>
            Your Tests
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              justifyItems: 'center',
            }}
          >
            {sortedTests.map((test) => (
              <TestNode test={test} amountOfQuestions={amountOfQuestions} key={test.id} isMobile={isMobile} />
            ))}
          </Box>
        </Box>
      </MainWrapper>
    </>
  )
}
