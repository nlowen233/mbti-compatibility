import { SQLTest, Test } from '@/types/SQLTypes'

export type SQLTestWithQuestions = SQLTest & { amountofquestions: string | null }

export type TestNodeProps = {
  test?: Partial<Test>
  amountOfQuestions?: number
  isMobile?: boolean
}
