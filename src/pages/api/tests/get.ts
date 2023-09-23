import type { NextApiRequest, NextApiResponse } from 'next'
import { SQLTestAnswers } from '../../../types/SQLTypes'
import { APIRes, IDReq } from '../../../types/misc'
import { db } from '@vercel/postgres'
import { SQLQueries } from '@/misc/SQLQueries'
import { SQL } from '@/misc/SQL'

export default function handler(req: NextApiRequest, res: NextApiResponse<APIRes<Partial<SQLTestAnswers>>>) {
  const { id } = req.body as Partial<IDReq>
  if (!id) {
    return res.status(400).send({ err: true, message: 'Body did not contain ID' })
  }
  db.connect()
    .then((client) => {
      SQL.query<Partial<SQLTestAnswers>>(client, SQLQueries.getTestProgressByID(id)).then((answersRes) => {
        client.release()
        res.status(!!answersRes.err ? 500 : 200).send({ ...answersRes, res: !!answersRes.res ? answersRes.res[0] : {} })
      })
    })
    .catch((err) => {
      res.status(500).send({ err: true, message: err })
    })
}
