import { Answer } from '@/types/SQLTypes'
import { ProgressStatus } from '@/types/misc'
import { createContext } from 'react'

export interface SessionContextShape {
  testToken: string | undefined
  setTestToken: React.Dispatch<React.SetStateAction<string | undefined>>
  savedProgress: Answer[] | undefined
  status: ProgressStatus
  setSavedProgress: React.Dispatch<React.SetStateAction<Answer[] | undefined>>
}

export const SessionContext = createContext<SessionContextShape>({
  testToken: undefined,
  setTestToken: () => {},
  savedProgress: undefined,
  status: 'not_checked_token',
  setSavedProgress: () => {},
})
