import { Constants } from '@/misc/Constants'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { VercelPoolClient, db } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import { SQLTestAnswers } from '../../../types/SQLTypes'
import { APIRes, IDReq } from '../../../types/misc'

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIRes<Partial<SQLTestAnswers>>>) {
  const { id } = req.query as Partial<IDReq>
  if (!id) {
    return res.status(400).send({ err: true, message: 'Body did not contain ID' })
  }
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
  const answersRes = await SQL.query<Partial<SQLTestAnswers>>(client, SQLQueries.getTestProgressByID(id))
  client.release()
  if (answersRes.err) {
    return res.status(500).send({ err: true, message: (error as string) || Constants.unknownError })
  }
  return res.status(!!answersRes.err ? 500 : 200).send({ ...answersRes, res: !!answersRes.res ? answersRes.res[0] : {} })
}
