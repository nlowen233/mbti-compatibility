import { IndexPageQueries, IndexPageState } from "@/components/_index/types"
import { SQLTest, SQLTestAnswers, Test, TestAnswers } from "@/types/SQLTypes"
import { Utils } from "./Utils"

const indexStateToQueryParams = (state:IndexPageState) =>{
    let query = []
    if(state.age){
        query.push(`${IndexPageQueries.age}=${state.age}`)
    }
    if(state.expectedResult){
        query.push(`${IndexPageQueries.expectedResult}=${state.expectedResult}`)
    }
    if(state.expectedResult){
        query.push(`${IndexPageQueries.mbtiType}=${state.mbtiType}`)
    }
    if(state.expectedResult){
        query.push(`${IndexPageQueries.gender}=${state.gender}`)
    }
    return query.join('&')
}

const sqlToTest = ({answers,created_at,id,status,user_id}:SQLTest) : Partial<Test> => ({
    answers: Utils.parsedJSONOrUndefined(answers),
    createdAt: Utils.fromSQLString(created_at),
    id: Utils.fromSQLString(id),
    status,
    userId: Utils.fromSQLString(user_id)
})

const sqlToTestAnswers = ({answers}:SQLTestAnswers) : Partial<TestAnswers> => ({
    answers: Utils.parsedJSONOrUndefined(answers),
})

export const Convert = {
    indexStateToQueryParams,
    sqlToTest,
    sqlToTestAnswers
}