import { Utils } from './Utils'

export const SQLQueries = {
  getTestByID: (testID: string) => `SELECT * from tests where id=${Utils.parameterize(testID)}`,
  getTestByUserAndID: (testID: string, userID: string) =>
    `SELECT * from tests where id=${Utils.parameterize(testID)} AND user_id=${Utils.parameterize(userID)}`,
  getQuestions: `SELECT * from questions order by "order" ASC`,
}
