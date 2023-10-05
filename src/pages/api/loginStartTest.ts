import { IndexPageState } from '@/components/_index/types'
import { Constants } from '@/misc/Constants'
import { Convert } from '@/misc/Convert'
import { SQL } from '@/misc/SQL'
import { Test } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import { Session, getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import type { UserProfile } from '@auth0/nextjs-auth0/client'
import { VercelPoolClient, db } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<APIRes<Partial<Test>>>) {
  const user = req.body as Partial<IndexPageState>
  let session: Session | null | undefined = null
  let sessionError
  try {
    session = await getSession(req, res)
  } catch (err) {
    sessionError = err
  }
  if (sessionError) {
    return res.status(500).send({ err: true, message: `There was an error getting the auth session: ${sessionError}` })
  }
  const auth = session?.user as UserProfile
  let client: undefined | VercelPoolClient
  let error
  try {
    client = await db.connect()
  } catch (err) {
    error = err
  }
  if (error || !client) {
    return res.status(500).send({ err: true, message: (error as string) || Constants.unknownError })
  }
  const testRes = await SQL.loginStartTest(client, { ...user, ...auth })
  client.release()
  return res
    .status(!!testRes.err ? 500 : 200)
    .send({ err: testRes.err, message: testRes.message, res: Convert.sqlToTest(testRes.res || {}) })
})
