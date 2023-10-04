import { MBTIScoreData, ScoreNode } from '@/components/_results/misc'

export type SQLTest = {
  id: string
  user_id: string
  status: number
  created_at: Date
  function_scores: string
  results_data: string
  gpt_response: string
} & SQLTestAnswers

export type SQLTestAnswers = {
  answers: string | null
}

export type SQLTestAndNickname = SQLTest & {
  nick_name: string
}

export type Test = {
  id: string
  userId: string
  status: TestStatus
  createdAt: string
  functionScores: ScoreNode[]
  results: MBTIScoreData[]
  gptResponse: string
} & TestAnswers

export type TestAnswers = {
  answers: Answer[]
}

export type TestAndNickname = Test & {
  nickName: string
}

export type Answer = {
  id: string
  score: number
}

export const enum TestStatus {
  New = 0,
  InProgress = 1,
  Finished = 3,
}

export type SQLError = {
  message?: string
}

export type SQLQuestion = {
  id: number
  scores: string | null
  text: string | null
}

export type Question = {
  id: string
  scores: Scores
  text: string
}

export type Scores = {
  Ni: number
  Ne: number
  Ti: number
  Te: number
  Fe: number
  Fi: number
  Si: number
  Se: number
}

export type SQLUser = {
  id: string
  age: string | null
  gender: string | null
  mbti_type: string | null
  expected_mbti_type: string | null
}

export type User = {
  id: string
  age: string
  gender: string
  mbtiType: string
  expectedMbtiType: string
}
