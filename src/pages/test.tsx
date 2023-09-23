import { MainWrapper } from '@/components/MainWrapper'
import {useEffect, useContext,useReducer} from 'react'
import { SessionContext } from '@/contexts/SessionContext'
import { useRouter } from 'next/router'
import { Head } from '@/components/Head'
import { GetServerSideProps } from 'next'
import { db } from '@vercel/postgres'
import { SQL } from '@/misc/SQL'
import { SQLQueries } from '@/misc/SQLQueries'
import { APIRes } from '@/types/misc'
import { SQLQuestion } from '@/types/SQLTypes'
import { Convert } from '@/misc/Convert'
import { SelectableQuestion } from '@/components/SelectableQuestion'
import { TestPageReducer } from '@/components/_test/reducer'

type Props = APIRes<SQLQuestion[]>

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const client = await db.connect()
  const res = await SQL.query<SQLQuestion>(client,SQLQueries.getQuestions)
  return {
    props: res
  }
}

export default function Test({err,message,res}:Props) {

  const router = useRouter()
  const [state,dispatch] = useReducer(TestPageReducer.reducer,TestPageReducer.INIT_STATE())
  const {testToken} = useContext(SessionContext)
  const {status}= useContext(SessionContext)

  const questions = res?.map(Convert.sqlToQuestion)

  const onScoreQuestion = (id:string,score:number)=>dispatch({id,score,type:'updateAnswer'})
  
  useEffect(()=>{
    if(!testToken&&status!=='not_checked_token'){
        //router.push('/') COMMENTED FOR TESTING
    }
  },[testToken,status])
  
  return (
    <>
      <Head/>
      <MainWrapper>
        {questions?.map((q,i)=>
          <SelectableQuestion
            onSelectScore={(score)=>onScoreQuestion(q.id as string,score)}
            key={q.id}
            question={q}
            score={state.answers.find(a=>a.id===q.id)?.score}
            questionIndex={i+1}
          />
        )}
      </MainWrapper>
    </>
  )
}
