import { Constants } from '@/misc/Constants'
import { Convert } from '@/misc/Convert'
import { Utils } from '@/misc/Utils'
import { Answer, Question, Scores } from '@/types/SQLTypes'
import { MBTI } from '@/types/misc'

export type ScoreNode = {
  value: number
  key: keyof Scores
}

export type NormalizationRes = {
  min: number
  max: number
  key: keyof Scores
}

const getMinMax = (questions: Partial<Question>[], key: keyof Scores): NormalizationRes => {
  const max = questions.reduce((acc, cur) => Math.abs((cur.scores as Scores)[key]) * 3 + acc, 0)
  const min = questions.reduce((acc, cur) => Math.abs((cur.scores as Scores)[key]) * -3 + acc, 0)
  return {
    key,
    max,
    min,
  }
}

const getAllMinMax = (questions: Partial<Question>[]): NormalizationRes[] =>
  Object.keys(Constants.INIT_FUNCTION_SCORES()).map((key) => ({
    ...getMinMax(questions, key as keyof Scores),
  }))

const scoreQuestionsForFunction = (questions: Partial<Question>[], answers: Answer[], key: keyof Scores): number =>
  questions
    .map((q) => {
      const matchedAnswer = answers.find((a) => a.id === q.id)
      return (matchedAnswer?.score || 0) * (q.scores as Scores)[key]
    })
    .reduce((acc, cur) => acc + cur, 0)

const scoreQuestionsForAllFunctions = (questions: Partial<Question>[], answers: Answer[]): ScoreNode[] =>
  Object.keys(Constants.INIT_FUNCTION_SCORES()).map((key) => ({
    key: key as keyof Scores,
    value: scoreQuestionsForFunction(questions, answers, key as keyof Scores),
  }))

const deriveCompatibleCognitiveScores = (questions: Partial<Question>[], answers: Answer[]): ScoreNode[] => {
  const ranges = getAllMinMax(questions)
  const scores = scoreQuestionsForAllFunctions(questions, answers)
  return scores.map((s) => {
    const range = ranges.find((range) => range.key === s.key)
    return {
      key: s.key,
      value: (s.value - (range?.min || 0)) / ((range?.max as number) - (range?.min as number)),
    }
  })
}

export type MBTIScoreData = {
  vector: number[]
  key: string
  compatibilityScore: number
}

const deriveCompatibilityVectors = (scores: ScoreNode[]): MBTIScoreData[] =>
  Constants.MBTIArray().map((mbti) => {
    const dom = scores.find((score) => score.key === mbti.dominant)
    const diffDom = 1 - Utils.getDistance(Convert.functionToScore('dominant'), dom?.value || 0)
    const aux = scores.find((score) => score.key === mbti.auxiliary)
    const diffAux = 1 - Utils.getDistance(Convert.functionToScore('auxiliary'), aux?.value || 0)
    const ter = scores.find((score) => score.key === mbti.tertiary)
    const diffTer = 1 - Utils.getDistance(Convert.functionToScore('tertiary'), ter?.value || 0)
    const inf = scores.find((score) => score.key === mbti.inferior)
    const diffInf = 1 - Utils.getDistance(Convert.functionToScore('inferior'), inf?.value || 0)
    const vector = [diffDom, diffAux, diffTer, diffInf]
    const compatibilityScore = vector.reduce((acc, cur) => acc + cur, 0) / vector.length
    return { key: mbti.name, vector, compatibilityScore }
  })

const arrayIndexToFunctionName = (i: number): keyof MBTI => {
  switch (i) {
    case 0:
      return 'dominant'
    case 1:
      return 'auxiliary'
    case 2:
      return 'tertiary'
    case 3:
      return 'inferior'
    default:
      return 'dominant'
  }
}

export const ResultsUtils = {
  deriveCompatibleCognitiveScores,
  deriveCompatibilityVectors,
  arrayIndexToFunctionName,
}
