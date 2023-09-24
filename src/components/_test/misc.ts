import { Answer, Question } from '@/types/SQLTypes'

const getReturnToPage = (paginatedQuestions: Partial<Question>[][], answers: Answer[]) => {
  const index = paginatedQuestions.findIndex((array) => array.some((q) => !answers.find((a) => a.id === q.id && Number.isInteger(a.score))))
  return index === -1 ? paginatedQuestions.length : index
}

export const TestPageUtils = {
  getReturnToPage,
}
