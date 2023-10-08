import { TestStatus } from '@/types/SQLTypes'
import { ErrorSeverity } from '@/types/misc'
import { Utils } from './Utils'

export const SQLQueries = {
  getTestByID: (testID: string) => `SELECT * from tests where id=${Utils.parameterize(testID)}`,
  getTestAndNicknameByID: (testID: string) =>
    `SELECT tests.*,users.nick_name from tests LEFT JOIN users ON tests.user_id = users.id where tests.id=${Utils.parameterize(testID)}`,
  getQuestions: `SELECT * from questions order by "order" ASC`,
  getAllCompletedTestIDs: `SELECT id from tests where tests.status =${TestStatus.Finished}`,
  getUserByID: (userID: string) => `SELECT * from users where id=${Utils.parameterize(userID)}`,
  insertError: (message: string, severity: ErrorSeverity) =>
    `INSERT INTO errors (message,severity) VALUES (${Utils.parameterize(message)},${Utils.parameterize(severity)})`,
  getAllTestsForUserID: (userID: string) =>
    `WITH QuestionsCount AS (SELECT COUNT(*) AS amountOfQuestions FROM questions) SELECT tests.*, QuestionsCount.amountOfQuestions FROM tests, QuestionsCount WHERE tests.user_id = ${Utils.parameterize(
      userID,
    )}`,
  doesTestExist: (testID: string, userID: string) =>
    `SELECT CASE WHEN EXISTS (SELECT 1 FROM tests WHERE user_id = ${Utils.parameterize(userID)} AND id = ${Utils.parameterize(
      testID,
    )}) THEN 'true' ELSE 'false' END AS result`,
}
