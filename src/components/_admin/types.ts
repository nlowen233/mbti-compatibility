import { Question, Scores } from '@/types/SQLTypes'

export type AdminPageState = {
  questions: Question[]
  cachedQuestions: Question[]
}

export type AdminPageAction = {
  type: `changeQuestionText` | 'changeQuestionScore' | `setQuestions`
  questions?: Question[]
  id?: string
  scoreKey?: keyof Scores
  scoreValue?: number
  text?: string
  fromServer?: boolean
}
