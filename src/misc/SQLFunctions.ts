export const SQLFunctions = {
  loginStartTest: (params: (string | number | null)[]) => `SELECT * FROM get_or_create_test(row(${params.join(',')})::users)`,
  updateQuestions: (paramsArray: (string | number | null)[]) =>
    `SELECT * from update_bulk_questions(ARRAY[${paramsArray.join(',')}]::JSONB[])`,
  updateTest: (params: (string | number | null)[]) => `SELECT * FROM update_test(${params.join(',')})`,
}
