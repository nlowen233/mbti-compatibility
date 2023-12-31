export type IndexPageState = {
  age: string | undefined
  gender: string | undefined
  mbtiType: string | undefined
  expectedResult: string | undefined
}

export type IndexPageAction = Partial<IndexPageState> & { type: `set${keyof IndexPageState}` | 'clear' | 'setwholestate' }

export const enum IndexPageQueries {
  age = 'age',
  expectedResult = 'expected',
  mbtiType = 'mbti',
  gender = 'gender',
}

export const enum IndexPageQueriesFix {
  code = 'code',
}

export type IndexPageQueryDictionary = {
  [key in IndexPageQueries]?: string
}

export type IndexPageQueryDictionaryFix = {
  [key in IndexPageQueriesFix]?: string
}
