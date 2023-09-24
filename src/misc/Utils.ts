import { Primitive } from '@/types/misc'
import { Constants } from './Constants'

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

const singleQuoteEscape = (s: string) => s.replace(/'/g, '')
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

export const Utils = {
  stringOrNull,
  numberOrNull,
  parameterize,
  parsedJSONOrUndefined,
  windowExists,
  getBaseURL,
  fromSQLString,
}
