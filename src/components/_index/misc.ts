import { IndexPageQueryDictionary } from './types'

//auth0 has issue with multiple query params in returnTo
const decodeWorkaround = (code: string): IndexPageQueryDictionary =>
  code
    .split('--')
    .map((k) => k.split('='))
    .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {})

export const IndexPageUtils = {
  decodeWorkaround,
}
