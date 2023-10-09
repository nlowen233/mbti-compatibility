import { IndexPageState } from '@/components/_index/types'
import { Question, Test } from '@/types/SQLTypes'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { APIRes, ResultIDReq } from '../types/misc'
import { Constants } from './Constants'
import { Utils } from './Utils'

export type Options<Req, Query> = {
  method?: 'POST' | 'GET'
  query?: Query
  body?: Req
  route: string
  debug?: boolean
}

async function createAPIFunction<Res = {}, Req = {}, Query = {}>({
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
  let res: AxiosResponse<APIRes<Res>> | undefined
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
    err: !!res.data.err,
    message: res.data.message || null,
    res: res.data.res,
  }
}

const loginStartTest = (req: Partial<IndexPageState>) =>
  createAPIFunction<Partial<Test>>({ route: '/api/loginStartTest', body: req, method: 'POST' })
const getTestAnswers = ({ id }: Partial<Test>) =>
  createAPIFunction<Partial<Test>>({ route: '/api/tests/get', method: 'GET', query: { id } })
const updateQuestions = (req: Question[]) =>
  createAPIFunction<Partial<Question>[]>({ route: '/api/questions/update', body: req, method: 'POST' })
const updateTest = (req: Partial<Test>) => createAPIFunction({ route: '/api/tests/update', body: req, method: 'POST' })
const createPaymentIntent = (req: ResultIDReq) => createAPIFunction<string>({ route: '/api/payment/create-payment-intent' })

export const API = {
  loginStartTest,
  getTestAnswers,
  updateQuestions,
  updateTest,
  createPaymentIntent,
}
