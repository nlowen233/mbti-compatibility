import { Test } from '@/types/SQLTypes'

export const enum ResultsPageQueries {
  testId = 'testId',
  resultsInState = 'resultsInState',
}

export type ResultsPageQueryDictionary = {
  [key in ResultsPageQueries]?: string
}

export type ResultsFromStateStatus = 'not_checked' | 'got_answers_from_state' | 'failed_to_get_answers'

export type ResultsViewProps = {
  style?: React.CSSProperties
  ctaText?: string
  ctaHref?: string
  test?: Partial<Test>
}
