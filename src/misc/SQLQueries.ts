import { Utils } from './Utils'

export const SQLQueries = {
  getTestProgressByID: (id: string) => `SELECT answers from tests where id=${Utils.parameterize(id)} and status !=3`,
  getQuestions: `SELECT * from questions order by "order" ASC`,
}
