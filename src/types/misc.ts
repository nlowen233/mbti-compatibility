export type Option<T extends string | number> = { value: T; display: string }

export interface APIRes<T> {
  err: boolean
  message?: string | null
  res?: T | null
}

export type Primitive = number | string | boolean | null | undefined

export type ResType = 'error' | 'success'

export type ProgressStatus =
  | 'not_checked_token'
  | 'has_token_will_attempt_resume'
  | 'does_not_have_token'
  | 'awaiting_server_call_to_resume'
  | 'successfully_restored_progress'
  | 'could_not_restore_progress'

export type IDReq = {
  id: string
}

export type RadioButtonOrder = 1|2|3|4|5|6|7