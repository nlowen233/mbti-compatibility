import { IndexPageQueries, IndexPageState } from '@/components/_index/types'
import { Question, SQLQuestion, SQLTest, SQLTestAndNickname, SQLTestAnswers, Test, TestAndNickname, TestAnswers } from '@/types/SQLTypes'
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

const sqlToTest = ({ answers, created_at, id, status, user_id }: Partial<SQLTest>): Partial<Test> => ({
  answers: Utils.parsedJSONOrUndefined(answers),
  createdAt: created_at?.toISOString(),
  id: Utils.fromSQLString(id || null),
  status,
  userId: Utils.fromSQLString(user_id || null),
})

const sqlToTestAndNickname = ({
  answers,
  created_at,
  id,
  status,
  user_id,
  nick_name,
}: Partial<SQLTestAndNickname>): Partial<TestAndNickname> => ({
  answers: Utils.parsedJSONOrUndefined(answers),
  createdAt: created_at?.toISOString(),
  id: Utils.fromSQLString(id || null),
  status,
  userId: Utils.fromSQLString(user_id || null),
  nickName: Utils.fromSQLString(nick_name || null),
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
      return 0.67
    case 'tertiary':
      return 0.33
    case 'inferior':
      return 0
    default:
      return 0
  }
}

export const Convert = {
  indexStateToQueryParams,
  sqlToTest,
  sqlToTestAnswers,
  sqlToQuestion,
  functionToScore,
  sqlToTestAndNickname,
}
