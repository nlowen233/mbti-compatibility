export const SQLFunctions = {
  loginStartTest: (params: (string | number | null)[]) => `SELECT * FROM get_or_create_test(row(${params.join(',')})::users)`,
  updateQuestion: (params: (string | number | null)[]) => `SELECT * FROM update_question(${params.join(',')})`,
  updateTest: (params: (string | number | null)[]) => `SELECT * FROM update_test(${params.join(',')})`,
}
