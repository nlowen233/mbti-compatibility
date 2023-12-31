import { IndexPageState } from '@/components/_index/types'
import { Question, SQLError, SQLQuestion, SQLTest, Test } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import { UserProfile } from '@auth0/nextjs-auth0/client'
import { QueryResult, QueryResultRow, VercelPoolClient } from '@vercel/postgres'
import { Constants } from './Constants'
import { SQLFunctions } from './SQLFunctions'
import { Utils } from './Utils'

const updateQuestions = async (client: VercelPoolClient, questions: Question[]): Promise<APIRes<SQLQuestion[]>> => {
  let error
  const paramsArray = questions.map(Utils.parameterize)
  let res = null
  try {
    res = await client.query(SQLFunctions.updateQuestions(paramsArray))
  } catch (err) {
    error = err
  }
  if (error) {
    return {
      err: true,
      message: error as string,
      res: null,
    }
  }
  return {
    err: false,
    message: null,
    res: res?.rows || [],
  }
}

const updateTest = async (
  client: VercelPoolClient,
  {
    id,
    answers,
    status,
    functionScores,
    gptResponse,
    results,
    isUpgraded,
    upgradedResponse1,
    upgradedResponse2,
    upgradedResponse3,
    upgradedResponse4,
    upgradedResponse5,
  }: Partial<Test>,
): Promise<APIRes<QueryResult<any>>> => {
  let error
  const params = []
  params.push(Utils.parameterize(id))
  params.push(Utils.parameterize(answers))
  params.push(Utils.parameterize(status))
  params.push(Utils.parameterize(functionScores))
  params.push(Utils.parameterize(results))
  params.push(Utils.parameterize(gptResponse))
  params.push(Utils.parameterize(isUpgraded))
  params.push(Utils.parameterize(upgradedResponse1))
  params.push(Utils.parameterize(upgradedResponse2))
  params.push(Utils.parameterize(upgradedResponse3))
  params.push(Utils.parameterize(upgradedResponse4))
  params.push(Utils.parameterize(upgradedResponse5))
  let res = null
  try {
    res = await client.query(SQLFunctions.updateTest(params))
  } catch (err) {
    error = err
  }
  if (error) {
    return {
      err: true,
      message: error as string,
      res: null,
    }
  }
  return {
    err: false,
    message: null,
    res,
  }
}

const loginStartTest = async (
  client: VercelPoolClient,
  { age, email, expectedResult, gender, name, nickname, sub, mbtiType, email_verified }: Partial<IndexPageState & UserProfile>,
): Promise<APIRes<Partial<SQLTest>>> => {
  let error
  const params = []
  params.push(Utils.parameterize(sub))
  params.push(Utils.parameterize(null)) //TODO IP
  params.push(Utils.parameterize(email))
  params.push(Utils.parameterize(age))
  params.push(Utils.parameterize(gender))
  params.push(Utils.parameterize(mbtiType))
  params.push(Utils.parameterize(expectedResult))
  params.push(Utils.parameterize(email_verified ? 1 : 0))
  params.push(Utils.parameterize(name))
  params.push(Utils.parameterize(nickname))
  let res = null
  try {
    res = await client.query(SQLFunctions.loginStartTest(params))
  } catch (err) {
    error = err
  }
  if (error) {
    return {
      err: true,
      message: error as string,
      res: null,
    }
  }
  return {
    err: false,
    message: null,
    res: res?.rows[0],
  }
}

async function query<Response extends QueryResultRow>(client: VercelPoolClient, query: string): Promise<APIRes<Response[]>> {
  let error: string | undefined
  let res = null
  try {
    res = await client.query<Response>(query)
  } catch (err) {
    error = (err as SQLError).message || Constants.unknownError
  }
  if (error) {
    return {
      err: true,
      message: error || null,
      res: null,
    }
  }
  return {
    err: false,
    message: null,
    res: (res?.rows.map(Utils.serializeSQLRow) as Response[]) || [],
  }
}

export const SQL = {
  loginStartTest,
  query,
  updateQuestions,
  updateTest,
}
