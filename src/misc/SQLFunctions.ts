export const SQLFunctions = {
    loginStartTest: (params: (string | number | null)[]) => `CALL mbti-compatibility-postgres.get_or_create_test(${params.join(',')})`,
}