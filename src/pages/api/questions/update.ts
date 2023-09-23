import type { NextApiRequest, NextApiResponse } from 'next'
import { APIRes } from '../../../types/misc'
import { QueryResult, db } from '@vercel/postgres'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import { Constants } from '@/misc/Constants'
import { Roles } from '@/misc/Roles'
import { SQL } from '@/misc/SQL'
import { Question } from '@/types/SQLTypes'

export default withApiAuthRequired(function handler(req: NextApiRequest, res: NextApiResponse<APIRes<QueryResult<any>>>) {
  getSession(req, res).then((session) => {
    const roles = session?.user[Constants.rolesNamespace] as string[] | undefined
    if (!roles?.includes(Roles.admin)) {
      const updatedQuestion = req.body as Partial<Question>
      db.connect()
        .then((client) => {
          SQL.updateQuestion(client, updatedQuestion).then((updateRes) => {
            client.release()
            res.status(!!updateRes.err ? 500 : 200).send(updateRes)
          })
        })
        .catch((err) => {
          res.status(500).send({ err: true, message: err.message, res: null })
        })
    }
  }).catch(()=>{
    res.status(500).send({err:true,message:'Could not get session data (auth0)'})
  })
})
