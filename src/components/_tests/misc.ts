import { Convert } from '@/misc/Convert'
import { Test, TestStatus, TestUpgradeStatus } from '@/types/SQLTypes'
import { SQLTestWithQuestions } from './types'

const convertSqlTestAndQuestionNum = (tests: Partial<SQLTestWithQuestions>[]): [Partial<Test>[], number] => {
  const amountQuestions = Number(tests[0]?.amountofquestions)
  const amountQuestionsSafe = Number.isNaN(amountQuestions) ? 0 : amountQuestions
  return [tests.map(Convert.sqlToTest), amountQuestionsSafe]
}

const indexToVariant = (i: number) => {
  switch (i) {
    case 0:
      return 'h4'
    case 1:
      return 'h5'
    case 2:
      return 'h6'
    default:
      return 'h3'
  }
}

const testStatusToButtonText = (status: number, upgradedStatus?: number) => {
  switch (status) {
    case TestStatus.Finished:
      return `Go To ${upgradedStatus === TestUpgradeStatus.upgraded ? 'Full' : ''} Results`
    case TestStatus.InProgress:
      return 'Finish Test'
    case TestStatus.New:
      return 'Begin Test'
    default:
      return ''
  }
}

export const TestsPageUtils = {
  convertSqlTestAndQuestionNum,
  indexToVariant,
  testStatusToButtonText,
}
