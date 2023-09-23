export type SQLTest = {
  id: string
  user_id: string
  status: number
  created_at: string
} & SQLTestAnswers

export type SQLTestAnswers = {
  answers: string | null
}

export type Test = {
  id: string
  userId: string
  status: TestStatus
  createdAt: string
} & TestAnswers

export type TestAnswers = {
  answers: Answer[]
}

export type Answer = {
  id: string
  score: number
}

export const enum TestStatus {
  New = 0,
  InProgress = 1,
  Finished = 2,
}

export type SQLError = {
  message?: string
}
