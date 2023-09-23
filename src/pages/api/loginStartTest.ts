import type { NextApiRequest, NextApiResponse } from 'next'
import { QueryResult, db } from '@vercel/postgres'
import { APIRes } from '@/types/misc'
import { IndexPageState } from '@/components/_index/types'
import { UserProfile} from '@auth0/nextjs-auth0/client'
import { SQL } from '@/misc/SQL'
import { Constants } from '@/misc/Constants'


export default function handler(req: NextApiRequest, res: NextApiResponse<APIRes<QueryResult<any>>>) {
    const user = req.body as Partial<IndexPageState&UserProfile>
    if(!Constants.Ages().find(node=>node.value===user.age)){
        return res.status(400).send({err:true,message:`Invalid age ${user.age}`})
    }
    if(!Constants.MBTIs().find(node=>node.value===user.mbtiType)){
        return res.status(400).send({err:true,message:`Invalid MBTI ${user.mbtiType}`})
    }
    if(!Constants.MBTIs().find(node=>node.value===user.expectedResult)){
        return res.status(400).send({err:true,message:`Invalid expected MBTI ${user.expectedResult}`})
    }
    if(!Constants.Genders().find(node=>node.value===user.gender)){
        return res.status(400).send({err:true,message:`Invalid gender ${user.gender}`})
    }
    db.connect().then(client=>{
        SQL.loginStartTest(client,user).then(testRes=>{
            client.release()
            res.status(!!testRes.err ? 500 : 200).send(testRes)
        })
    }).catch((err)=>{
        res.status(500).send({err:true,message:err.message,res:null})
    })
};