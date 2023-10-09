import { MBTIScoreData, ScoreNode } from '@/components/_results/misc'

export type SQLTest = {
  id: string
  user_id: string
  status: number
  created_at: string
  gpt_response: string | null
  is_upgraded: number | null
  upgraded_response1: string | null
  upgraded_response2: string | null
  upgraded_response3: string | null
  upgraded_response4: string | null
  upgraded_response5: string | null
} & SQLTestAnswers &
  SQLTestResults

export type SQLTestAnswers = {
  answers: string | null
}

export type SQLTestResults = {
  function_scores: string | null
  results_data: string | null
}

export type SQLTestAndNickname = SQLTest & {
  nick_name: string
}

export type Test = {
  id: string
  userId: string
  status: TestStatus
  createdAt: string
  gptResponse: string
  isUpgraded: number
  upgradedResponse1: string
  upgradedResponse2: string
  upgradedResponse3: string
  upgradedResponse4: string
  upgradedResponse5: string
} & TestAnswers &
  TestResults

export type TestResults = {
  functionScores: ScoreNode[]
  results: MBTIScoreData[]
}

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

export type UserWithTestResults = User & TestResults

export type SQLResult = {
  result: boolean
}

export const enum TestUpgradeStatus {
  notUpgraded = 0,
  successfullyPurchasedWaitingForGPT = 5,
  upgraded = 10,
}

export type SQLUserWithTestResults = SQLUser & SQLTestResults
