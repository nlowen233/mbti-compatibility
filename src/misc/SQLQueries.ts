import { Utils } from "./Utils";

export const SQLQueries = {
    getTestProgressByID: (id:string)=> `SELECT answers from mbti-compatibility-postgres.tests where id=${Utils.parameterize(id)} and status !=3`,
    getQuestions: ()=> `SELECT * from from mbti-compatibility-postgres.questions`
}