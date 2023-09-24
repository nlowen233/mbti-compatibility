import { Scores } from '@/types/SQLTypes'
import { Option } from '@/types/misc'

const MBTIs = (): Option<string>[] => [
  { display: 'ENTP', value: 'ENTP' },
  { display: 'ENTJ', value: 'ENTJ' },
  { display: 'INTJ', value: 'INTJ' },
  { display: 'INTP', value: 'INTP' },
  { display: 'ENFP', value: 'ENFP' },
  { display: 'ENFJ', value: 'ENFJ' },
  { display: 'INFP', value: 'INFP' },
  { display: 'INFJ', value: 'INFJ' },
  { display: 'ESTP', value: 'ESTP' },
  { display: 'ESTJ', value: 'ESTJ' },
  { display: 'ISTP', value: 'ISTP' },
  { display: 'ISTJ', value: 'ISTJ' },
  { display: 'ESFP', value: 'ESFP' },
  { display: 'ESFJ', value: 'ESFJ' },
  { display: 'ISFJ', value: 'ISFJ' },
  { display: 'ISFP', value: 'ISFP' },
  { display: 'Not sure', value: 'NS' },
]

const Ages = (): Option<string>[] => [
  { display: '12 or under', value: 'u12' },
  { display: '13-17', value: '13-17' },
  { display: '18-22', value: '18-22' },
  { display: '23-26', value: '23-26' },
  { display: '27-33', value: '27-33' },
  { display: '34-40', value: '34-40' },
  { display: '41-50', value: '41-50' },
  { display: '51 or over', value: 'o51' },
]

const Genders = (): Option<string>[] => [
  { display: 'Male', value: 'M' },
  { display: 'Female', value: 'F' },
  { display: 'Other', value: '?' },
]

const Scores = (): Option<number>[] => [
  { display: '-3', value: -3 },
  { display: '-2', value: -2 },
  { display: '-1', value: -1 },
  { display: '0', value: 0 },
  { display: '1', value: 1 },
  { display: '2', value: 2 },
  { display: '3', value: 3 },
]

const INIT_FUNCTION_SCORES = (): Scores => ({
  Fe: 0,
  Fi: 0,
  Ne: 0,
  Ni: 0,
  Se: 0,
  Si: 0,
  Te: 0,
  Ti: 0,
})

export const Constants = {
  MBTIs,
  Ages,
  Genders,
  unknownError: 'Unexpected error occured',
  unknownSQLError: 'SQL returned error with no message',
  developmentHost: process.env.NEXT_PUBLIC_DEVELOPMENT_HOST,
  rolesNamespace: 'https://mbti-compatibility.com/roles',
  Scores,
  INIT_FUNCTION_SCORES,
}
