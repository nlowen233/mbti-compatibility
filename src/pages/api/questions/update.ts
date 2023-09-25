import { Convert } from '@/misc/Convert'
import { SQL } from '@/misc/SQL'
import { Utils } from '@/misc/Utils'
import { Question } from '@/types/SQLTypes'
import { Session, getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import { VercelPoolClient, db } from '@vercel/postgres'
import type { NextApiRequest, NextApiResponse } from 'next'
import { APIRes } from '../../../types/misc'

export default withApiAuthRequired(async function handler(req: NextApiRequest, res: NextApiResponse<APIRes<Partial<Question>[]>>) {
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
  if (Utils.isAdmin(session?.user)) {
    return res.status(500).send({ err: true, message: `You don't have permission to change update this resource` })
  }
  let client: VercelPoolClient | undefined
  try {
    client = await db.connect()
  } catch (err) {
    error = err
  }
  if (error || !client) {
    return res.status(500).send({ err: true, message: error as string, res: null })
  }
  const updatedQuestions = req.body as Question[]
  const updateRes = await SQL.updateQuestions(client, updatedQuestions)
  client.release()
  return res.status(!!updateRes.err ? 500 : 200).send({ ...updateRes, res: updateRes.res?.map(Convert.sqlToQuestion) || [] })
})
