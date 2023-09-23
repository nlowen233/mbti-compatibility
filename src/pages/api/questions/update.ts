import type { NextApiRequest, NextApiResponse } from 'next'
import { APIRes } from '../../../types/misc'
import { QueryResult, db } from '@vercel/postgres'
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(function handler(req: NextApiRequest, res: NextApiResponse<APIRes<QueryResult<any>>>) {
    getSession(req, res).then(session=>{
        console.log(session?.user)
        res.status(200).send({err:false})
    })
    // const updatedQuestion = req.body as Partial<Question>
    // db.connect().then(client=>{
    //     SQL.updateQuestion(client,updatedQuestion).then(updateRes=>{
    //         client.release()
    //         res.status(!!updateRes.err ? 500 : 200).send(updateRes)
    //     })
    // }).catch((err)=>{
    //     res.status(500).send({err:true,message:err.message,res:null})
    // })
});