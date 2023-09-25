import { Constants } from '@/misc/Constants'
import { Convert } from '@/misc/Convert'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { Session, getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { VercelPoolClient, db } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import { SQLTest, Test } from '../../../types/SQLTypes'
import { APIRes } from '../../../types/misc'

async function handler(req: NextApiRequest, res: NextApiResponse<APIRes<Partial<Test>>>) {
  let session: Session | null | undefined = null
  let error
  try {
    session = await getSession(req, res)
  } catch (err) {
    error = err
  }
  if (error) {
    return res.status(401).send({ err: true, message: 'Could not get session data (auth0)' })
  }
  const userId = session?.user.sub
  const { id } = req.query as Partial<Test>
  if (!id) {
    return res.status(400).send({ err: true, message: 'Body did not contain testID' })
  }
  let client: undefined | VercelPoolClient
  try {
    client = await db.connect()
  } catch (err) {
    error = err
  }
  if (error || !client) {
    return res.status(500).send({ err: true, message: (error as string) || Constants.unknownError })
  }
  const testRes = await SQL.query<Partial<SQLTest>>(client, SQLQueries.getTestByUserAndID(id, userId))
  client.release()
  if (testRes.err) {
    return res.status(500).send({ err: true, message: (error as string) || Constants.unknownError })
  }
  const tests = testRes.res || []
  if (!tests?.length) {
    return res.status(404).send({ err: true, message: 'Could not find a test with that ID' })
  }
  const test = tests[0]
  return res.status(!!testRes.err ? 500 : 200).send({ ...testRes, res: Convert.sqlToTest(test) })
}

export default withApiAuthRequired(handler)
