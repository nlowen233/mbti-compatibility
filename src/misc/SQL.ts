import { IndexPageState } from '@/components/_index/types'
import { QueryResult, QueryResultRow, VercelPoolClient, db } from '@vercel/postgres'
import { UserProfile } from '@auth0/nextjs-auth0/client'
import { APIRes } from '@/types/misc'
import { Utils } from './Utils'
import { SQLFunctions } from './SQLFunctions'
import { Question, SQLError } from '@/types/SQLTypes'
import { Constants } from './Constants'

const loginStartTest = async (
  client: VercelPoolClient,
  { age, email, expectedResult, gender, name, nickname, sub, mbtiType, email_verified }: Partial<IndexPageState & UserProfile>,
): Promise<APIRes<QueryResult<any>>> => {
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
    res,
  }
}

const updateQuestion = async (
  client: VercelPoolClient,
  { id,scores,text }: Partial<Question>,
): Promise<APIRes<QueryResult<any>>> => {
  let error
  const params = []
  params.push(Utils.parameterize(id))
  params.push(Utils.parameterize(text))
  params.push(Utils.parameterize(scores))
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
    res,
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
    res: res?.rows || [],
  }
}

export const SQL = {
  loginStartTest,
  query,
  updateQuestion
}
