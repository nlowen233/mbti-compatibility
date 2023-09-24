import { Colors } from '@/misc/Colors'
import { Utils } from '@/misc/Utils'
import { Question, Scores } from '@/types/SQLTypes'

const getFunctionTotal = (questions: Question[], key: keyof Scores): number => questions.reduce((acc, cur) => acc + cur.scores[key], 0)

const getAllFunctionTotals = (questions: Question[]): Scores => ({
  Fe: getFunctionTotal(questions, 'Fe'),
  Fi: getFunctionTotal(questions, 'Fi'),
  Ti: getFunctionTotal(questions, 'Ti'),
  Te: getFunctionTotal(questions, 'Te'),
  Se: getFunctionTotal(questions, 'Se'),
  Si: getFunctionTotal(questions, 'Si'),
  Ne: getFunctionTotal(questions, 'Ne'),
  Ni: getFunctionTotal(questions, 'Ni'),
})

const getAverageFunctionKey = (funcs: Scores): [number, number] => {
  const keys = Object.keys(funcs)
  //@ts-ignore
  const average = keys.reduce((acc, cur) => acc + funcs[cur], 0) / keys.length
  const averageKey = keys.reduce((acc, cur) => {
    const curFunc = funcs[cur as keyof Scores]
    const comparingFunc = funcs[acc as keyof Scores]
    if (Utils.getDistance(curFunc, average) < Utils.getDistance(comparingFunc, average)) {
      return cur
    } else {
      return acc
    }
  }, keys[0])
  return [average, funcs[averageKey as keyof Scores]]
}

const deriveScoreColor = (average: number, score: number) => {
  if (score === average) {
    return Colors.justRight
  }
  return score > average ? Colors.tooHigh : Colors.tooLow
}

const allScoresAreEqual = (scores: Scores) => {
  const base = scores.Fe
  return Object.keys(scores).every((key) => scores[key as keyof Scores] === base)
}

export const AdminUtils = {
  getAllFunctionTotals,
  getAverageFunctionKey,
  deriveScoreColor,
  allScoresAreEqual,
}
