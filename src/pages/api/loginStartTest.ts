import { IndexPageState } from '@/components/_index/types'
import { Constants } from '@/misc/Constants'
import { SQL } from '@/misc/SQL'
import { SQLTest } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import { UserProfile } from '@auth0/nextjs-auth0/client'
import { VercelPoolClient, db } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse<APIRes<Partial<SQLTest>>>) {
  const user = req.body as Partial<IndexPageState & UserProfile>
  if (!Constants.Ages().find((node) => node.value === user.age)) {
    return res.status(400).send({ err: true, message: `Invalid age ${user.age}` })
  }
  if (!Constants.MBTIs().find((node) => node.value === user.mbtiType)) {
    return res.status(400).send({ err: true, message: `Invalid MBTI ${user.mbtiType}` })
  }
  if (!Constants.MBTIs().find((node) => node.value === user.expectedResult)) {
    return res.status(400).send({ err: true, message: `Invalid expected MBTI ${user.expectedResult}` })
  }
  if (!Constants.Genders().find((node) => node.value === user.gender)) {
    return res.status(400).send({ err: true, message: `Invalid gender ${user.gender}` })
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
  const testRes = await SQL.loginStartTest(client, user)
  client.release()
  return res.status(!!testRes.err ? 500 : 200).send({ err: testRes.err, message: testRes.message, res: testRes.res })
}
