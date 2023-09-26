import { Utils } from './Utils'

export const SQLQueries = {
  getTestByID: (testID: string) => `SELECT * from tests where id=${Utils.parameterize(testID)}`,
  getTestAndNicknameByID: (testID: string) =>
    `SELECT tests.*,users.nick_name from tests INNER JOIN users ON tests.user_id = users.id where tests.id=${Utils.parameterize(testID)}`,
  getQuestions: `SELECT * from questions order by "order" ASC`,
  getAllTestIDs: `SELECT id from tests`,
}
