import { IndexPageQueries, IndexPageState } from '@/components/_index/types'
import {
  Question,
  SQLQuestion,
  SQLTest,
  SQLTestAndNickname,
  SQLTestAnswers,
  SQLUser,
  Test,
  TestAndNickname,
  TestAnswers,
  User,
} from '@/types/SQLTypes'
import { MBTI } from '@/types/misc'
import { Utils } from './Utils'

const indexStateToQueryParams = (state: IndexPageState) => {
  let query = []
  if (state.age) {
    query.push(`${IndexPageQueries.age}=${state.age}`)
  }
  if (state.expectedResult) {
    query.push(`${IndexPageQueries.expectedResult}=${state.expectedResult}`)
  }
  if (state.mbtiType) {
    query.push(`${IndexPageQueries.mbtiType}=${state.mbtiType}`)
  }
  if (state.gender) {
    query.push(`${IndexPageQueries.gender}=${state.gender}`)
  }
  return query.map(encodeURI).join('--')
}

const sqlToTest = ({
  answers,
  created_at,
  id,
  status,
  user_id,
  function_scores,
  gpt_response,
  results_data,
  is_upgraded,
  upgraded_response1,
  upgraded_response2,
  upgraded_response3,
  upgraded_response4,
  upgraded_response5,
}: Partial<SQLTest>): Partial<Test> => ({
  answers: Utils.parsedJSONOrUndefined(answers),
  createdAt: created_at,
  id: Utils.fromSQLString(id || null),
  status,
  userId: Utils.fromSQLString(user_id || null),
  functionScores: Utils.parsedJSONOrUndefined(function_scores),
  gptResponse: Utils.fromSQLString(gpt_response || null),
  results: Utils.parsedJSONOrUndefined(results_data),
  isUpgraded: is_upgraded || 0,
  upgradedResponse1: Utils.fromSQLString(upgraded_response1 || null),
  upgradedResponse2: Utils.fromSQLString(upgraded_response2 || null),
  upgradedResponse3: Utils.fromSQLString(upgraded_response3 || null),
  upgradedResponse4: Utils.fromSQLString(upgraded_response4 || null),
  upgradedResponse5: Utils.fromSQLString(upgraded_response5 || null),
})

const sqlToTestAndNickname = (params: Partial<SQLTestAndNickname>): Partial<TestAndNickname> => ({
  ...sqlToTest(params),
  nickName: Utils.fromSQLString(params.nick_name || null),
})

const sqlToTestAnswers = ({ answers }: SQLTestAnswers): Partial<TestAnswers> => ({
  answers: Utils.parsedJSONOrUndefined(answers),
})

const sqlToQuestion = (q: SQLQuestion): Partial<Question> => ({
  id: `${q.id}`,
  scores: Utils.parsedJSONOrUndefined(q.scores),
  text: Utils.fromSQLString(q.text),
})

const functionToScore = (mbti: keyof MBTI): number => {
  switch (mbti) {
    case 'dominant':
      return 1
    case 'auxiliary':
      return 0.75
    case 'tertiary':
      return 0.25
    case 'inferior':
      return 0
    default:
      return 0
  }
}

const sqlToUser = ({ age, expected_mbti_type, gender, id, mbti_type }: SQLUser): User => ({
  age: age || '',
  expectedMbtiType: expected_mbti_type || '',
  gender: gender || '',
  id,
  mbtiType: mbti_type || '',
})

export const Convert = {
  indexStateToQueryParams,
  sqlToTest,
  sqlToTestAnswers,
  sqlToQuestion,
  functionToScore,
  sqlToTestAndNickname,
  sqlToUser,
}
