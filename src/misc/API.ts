import axios, { AxiosError, AxiosResponse } from 'axios'
import { APIRes, IDReq } from '../types/misc'
import { Constants } from './Constants'
import { Utils } from './Utils'
import { IndexPageState } from '@/components/_index/types'
import { UserProfile } from '@auth0/nextjs-auth0/client'
import { Question, SQLTest, SQLTestAnswers } from '@/types/SQLTypes'

export type Options<Req, Query> = {
  method?: 'POST' | 'GET'
  query?: Query
  body?: Req
  route: string
  debug?: boolean
}

async function createAPIFunction<Res, Req = {}, Query = {}>({
  route,
  body,
  method,
  query,
  debug,
}: Options<Req, Query>): Promise<APIRes<Res>> {
  const host = Utils.getBaseURL()
  if (!host) {
    return {
      err: true,
      message: 'Missing API end point env variable',
      res: null,
    }
  }
  let res: AxiosResponse<Res> | undefined
  let error: string | undefined
  try {
    res = await axios({
      method: method || 'GET',
      url: `${host}${route}`,
      params: { ...query },
      data: body,
    })
  } catch (err) {
    error = (err as AxiosError).message
  }
  if (error || !res) {
    return {
      err: true,
      message: error || Constants.unknownError,
      res: null,
    }
  }
  return {
    err: !!error,
    message: error || null,
    res: res.data,
  }
}

const loginStartTest = (req: Partial<IndexPageState & UserProfile>) =>
  createAPIFunction<SQLTest>({ route: '/api/loginStartTest', body: req, method: 'POST' })
const getAnswersByTestID = (req: IDReq) => createAPIFunction<SQLTestAnswers>({ route: '/api/tests/get', body: req, method: 'POST' })
const updateQuestion = (req: Partial<Question>) => createAPIFunction({ route: '/api/questions/update', body: req, method: 'POST' })

export const API = {
  loginStartTest,
  getAnswersByTestID,
  updateQuestion
}
