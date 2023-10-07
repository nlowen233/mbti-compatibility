import { Convert } from '@/misc/Convert'
import { OpenAI } from '@/misc/OpenAI'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { SQLUser, Test, TestStatus } from '@/types/SQLTypes'
import { Session, getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { QueryResult, VercelPoolClient, db } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import { APIRes, ErrorSeverity } from '../../../types/misc'

export const config = {
  maxDuration: 300,
}

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<APIRes<QueryResult<any>>>) {
  const updatedTest = req.body as Partial<Test>
  if (updatedTest.answers?.some((a) => !a.id)) {
    return res.status(400).send({ err: true, message: 'The answers array has missing question ids' })
  }
  let client: VercelPoolClient | undefined
  let error
  try {
    client = await db.connect()
  } catch (err) {
    error = err
  }
  if (error || !client) {
    return res.status(500).send({ err: true, message: error as string, res: null })
  }
  if (updatedTest.status === TestStatus.Finished && !!updatedTest.functionScores?.length && !!updatedTest.results?.length) {
    let session: Session | null | undefined = null
    let sessionError: string | undefined
    try {
      session = await getSession(req, res)
    } catch (err) {
      sessionError = err as string
    }
    const id = session?.user.sub as string | undefined
    if (sessionError) {
      await SQL.query(
        client,
        SQLQueries.insertError(
          `Error updating test: Could not get user session. Affected test ID was ${updatedTest.id}. Error: ${sessionError}`,
          ErrorSeverity.Error,
        ),
      )
    } else {
      let userRes = await SQL.query<SQLUser>(client, SQLQueries.getUserByID(id as string))
      if (userRes?.err) {
        await SQL.query(
          client,
          SQLQueries.insertError(
            `Error updating test: Could not get user by id from database. Affected Test ID was ${updatedTest.id}. User id was ${id}. Error: ${userRes?.message}`,
            ErrorSeverity.Error,
          ),
        )
      } else {
        const user = userRes?.res?.length ? userRes.res[0] : undefined
        let gptRes = await OpenAI.getResultsExplanation(Convert.sqlToUser(user as SQLUser), updatedTest.functionScores, updatedTest.results)
        if (gptRes.err) {
          await SQL.query(
            client,
            SQLQueries.insertError(
              `Error updating test: GPT responded with error. Affected Test ID was ${updatedTest.id}. Error ${gptRes.message}`,
              ErrorSeverity.Error,
            ),
          )
        } else {
          updatedTest.gptResponse = gptRes.res?.choices[0].message.content || undefined
        }
      }
    }
  }
  const updateRes = await SQL.updateTest(client, updatedTest)
  client.release()
  return res.status(!!updateRes.err ? 500 : 200).send(updateRes)
})
