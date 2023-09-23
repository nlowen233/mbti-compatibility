import { Answer } from '@/types/SQLTypes'
import { TestPageAction, TestPageState } from './types'

const INIT_STATE = (): TestPageState => ({
  answers: [],
})

const reducer = (state: TestPageState, action: TestPageAction): TestPageState => {
  switch (action.type) {
    case 'setAnswers':
      return { ...state, answers: action.answers || [] }
    case 'updateAnswer':
      const index = state.answers.findIndex((a) => a.id === action.id)
      if(!action.id){
        return {...state}
      }
      if (index === -1) {
        return { ...state,answers: [...state.answers,{id:action.id,score:action.score||0}] }
      }
      const toUpdate = state.answers[index]
      const updated: Answer = { ...toUpdate, score: action.score || 0 }
      return { ...state, answers: [...state.answers.slice(0, index), updated, ...state.answers.slice(index + 1)] }
  }
}

export const TestPageReducer = {
  reducer,
  INIT_STATE,
}
