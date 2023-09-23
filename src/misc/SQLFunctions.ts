export const SQLFunctions = {
    loginStartTest: (params: (string | number | null)[]) => `CALL get_or_create_test(${params.join(',')})`,
    updateQuestion: (params: (string | number | null)[]) => `CALL update_question(${params.join(',')})`,
}