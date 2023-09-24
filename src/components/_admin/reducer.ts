import { Question } from '@/types/SQLTypes'
import { AdminPageAction, AdminPageState } from './types'

const INIT_STATE = (questions?: Question[]): AdminPageState => ({
  questions: questions || [],
  cachedQuestions: questions || [],
})

const reducer = (state: AdminPageState, action: AdminPageAction): AdminPageState => {
  const newState = { ...state }
  switch (action.type) {
    case 'setQuestions':
      newState.questions = action.questions || []
      if (action.fromServer) {
        newState.cachedQuestions = action.questions || []
      }
      return newState
    case 'changeQuestionScore':
    case 'changeQuestionText':
      if (!action.id) {
        return { ...state }
      }
      const index = state.questions.findIndex((q) => q.id === action.id)
      if (index === -1) {
        return { ...state }
      }
      const questionToUpdate = { ...state.questions[index] }
      if (action.type === 'changeQuestionScore' && !!action.scoreKey && action.scoreValue !== undefined) {
        questionToUpdate.scores = { ...questionToUpdate.scores, [action.scoreKey]: action.scoreValue }
      }
      if (action.type === 'changeQuestionText') {
        questionToUpdate.text = action.text || ''
      }
      return { ...state, questions: [...state.questions.slice(0, index), questionToUpdate, ...state.questions.slice(index + 1)] }
  }
}

export const AdminPageReducer = {
  reducer,
  INIT_STATE,
}
