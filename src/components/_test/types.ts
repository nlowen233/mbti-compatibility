import { Answer } from '@/types/SQLTypes'

export type TestPageState = {
  answers: Answer[]
}

export type TestPageAction = { id?: string; score?: number, answers?: Answer[], type: 'updateAnswer'|'setAnswers' }
