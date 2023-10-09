import { Primitive } from '@/types/misc'
import { Claims } from '@auth0/nextjs-auth0'
import { QueryResultRow } from '@vercel/postgres'
import dayjs from 'dayjs'
import Dinero from 'dinero.js'
import { Constants } from './Constants'
import { Paths } from './Paths'
import { Roles } from './Roles'

const windowExists = () => typeof window === 'object' && window !== null

const stringOrNull = (s: Primitive) => {
  if (s === undefined || s === null) {
    return null
  }
  return `${s}`
}

const numberOrNull = (s: string | number | undefined) => {
  if (s === undefined || s === null) {
    return null
  }
  const _s = Number(s)
  if (Number.isNaN(_s)) {
    return null
  } else {
    return _s
  }
}

const validJSONorNull = (k: Record<string, any>) => {
  let json
  try {
    json = JSON.stringify(k)
  } catch (err) {}
  if (!json) {
    return null
  } else return json
}

const parsedJSONOrUndefined = (s?: string | null) => {
  if (!s) {
    return undefined
  }
  let json
  try {
    json = JSON.parse(singleQuoteUnescape(s))
  } catch (err) {}
  if (json) {
    return json
  } else {
    return undefined
  }
}

const singleQuoteEscape = (s: string) => s.replace(/'/g, "''")
const singleQuoteUnescape = (s: string) => s.replace(/''/g, "'")
const fromSQLString = (s: string | null) => (s === null ? undefined : singleQuoteUnescape(s))

const parameterize = (p: Primitive | Record<string, any>) => {
  switch (typeof p) {
    case 'object':
      if (p === null) {
        return 'null'
      }
      const jsonString = validJSONorNull(p)
      if (jsonString === null) {
        return 'null'
      }
      return `'${singleQuoteEscape(jsonString)}'`
    case 'number':
      if (typeof p === 'object' || typeof p === 'boolean') {
        return 'null'
      }
      return numberOrNull(p)
    case 'string':
      if (typeof p === 'object' || typeof p === 'undefined') {
        return 'null'
      }
      const _string = stringOrNull(p)
      if (_string === null) {
        return 'null'
      }
      return `'${singleQuoteEscape(_string)}'`
    default:
      return 'null'
  }
}

const getBaseURL = () => {
  if (windowExists()) {
    return window.location.origin
  } else {
    const vercelUrl = process.env.VERCEL_URL
    return !!vercelUrl ? `https://${process.env.VERCEL_URL}` : Constants.developmentHost
  }
}

const getDistance = (n1: number, n2: number) => Math.abs(n1 - n2)

const sigmoidFunction = (x: number, weight = 1) => 1 / (1 + Math.pow(Math.E, weight * x))

const isAdmin = (user?: Claims) => {
  if (!user) {
    return false
  }
  const roles = user[Constants.rolesNamespace] as string[] | undefined
  return roles?.includes(Roles.admin)
}

const shareResults = async (testID: string): Promise<string | false> => {
  let error: string | undefined
  try {
    await navigator.share({
      title: 'MBTI Compatibility Test',
      url: `https://${window.location.host}${Paths.results}/${testID}`,
    })
  } catch (err) {
    error = err as string
  }
  if (!error) {
    return false
  } else {
    return error
  }
}

const serializeSQLRow = (row: QueryResultRow) => {
  const newRow = { ...row }
  const keys = Object.keys(newRow) as (keyof QueryResultRow)[]
  keys.forEach((key) => {
    const pivot = newRow[key]
    if (pivot instanceof Date) {
      newRow[key] = pivot.toISOString()
    }
  })
  return newRow as QueryResultRow
}

const displayDateTime = (date?: string) => (dayjs(date).isValid() ? dayjs(date).format('MM/DD/YYYY h:mmA') : 'Invalid Date')

const toPercentage = (n: number) => (Number.isNaN(n) || n > 1 || n < 0 ? '0%' : `${(n * 100).toFixed(0)}%`)

const toDineroFormat = (n?: number | null) => Dinero({ amount: n || 0, currency: 'USD', precision: 2 }).toFormat()

const getPathToTextFile = (directoriesAndFileName: string[]) => [process.cwd(), ...directoriesAndFileName].join('\\')

export const Utils = {
  stringOrNull,
  numberOrNull,
  parameterize,
  parsedJSONOrUndefined,
  windowExists,
  getBaseURL,
  fromSQLString,
  getDistance,
  sigmoidFunction,
  isAdmin,
  shareResults,
  serializeSQLRow,
  displayDateTime,
  toPercentage,
  toDineroFormat,
  getPathToTextFile,
}
