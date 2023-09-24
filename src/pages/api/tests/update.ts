import { SQL } from '@/misc/SQL'
import { Test } from '@/types/SQLTypes'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'
import { QueryResult, VercelPoolClient, db } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import { APIRes } from '../../../types/misc'

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
  const updateRes = await SQL.updateTest(client, updatedTest)
  client.release()
  return res.status(!!updateRes.err ? 500 : 200).send(updateRes)
})
