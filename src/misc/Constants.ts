import { MBTIScoreData, ScoreNode } from '@/components/_results/misc'
import { Scores, User } from '@/types/SQLTypes'
import { MBTI, Option } from '@/types/misc'
import { MBTIs } from './MBTI'

const MBTIOptions = (): Option<string>[] => [
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

const MBTIArray = (): MBTI[] => [
  MBTIs.ENTJ(),
  MBTIs.INTJ(),
  MBTIs.ENTP(),
  MBTIs.INTP(),
  MBTIs.ENFJ(),
  MBTIs.INFJ(),
  MBTIs.ENFP(),
  MBTIs.INFP(),
  MBTIs.ESTJ(),
  MBTIs.ISTJ(),
  MBTIs.ESFJ(),
  MBTIs.ISFJ(),
  MBTIs.ESTP(),
  MBTIs.ISTP(),
  MBTIs.ESFP(),
  MBTIs.ISFP(),
]

const SIGMOID_WEIGHT = () => 1

const TRUE = () => 'true'

const explainResultsPromptTemplate = (user: User, scores: ScoreNode[], results: MBTIScoreData[]) =>
  `Gender: ${user.gender || 'null'}\nAge: ${user.age || 'null'}\nMBTI type: ${
    user.mbtiType || 'null'
  }\nUser's expected most compatible MBTI type: ${user.expectedMbtiType || 'null'}\nscores:\n${
    scores ? JSON.stringify(scores) : 'null'
  }\nresults:\n${results ? JSON.stringify([...results].sort((a, b) => b.compatibilityScore - a.compatibilityScore)) : 'null'}`

const windowExists = () => typeof window === 'object' && window !== null

export const Constants = {
  MBTIOptions,
  Ages,
  Genders,
  unknownError: 'Unexpected error occurred',
  unknownSQLError: 'SQL returned error with no message',
  developmentHost: process.env.NEXT_PUBLIC_DEVELOPMENT_HOST,
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  githubLink: process.env.NEXT_PUBLIC_GITHUB_LINK,
  rolesNamespace: 'https://mbti-compatibility.com/roles',
  Scores,
  INIT_FUNCTION_SCORES,
  numberOfButtonsOnScale: 7,
  MBTIArray,
  SIGMOID_WEIGHT,
  TRUE,
  explainResultsPromptTemplate,
  disclaimer: `*By getting verified, you acknowledge that your test outcomes may be anonymously included in survey data. You also consent to your data being used to tailor potential future services offered. Your information will be securely stored in a private database. You will not get ANY emails from this application or others in its network unless you give explicit permission.`,
  isMaintenance: process.env.NEXT_PUBLIC_MAINTENANCE === TRUE(),
  enhancePrice: !Number.isNaN(Number(process.env.NEXT_PUBLIC_ENHANCE_PRICE)) ? Number(process.env.NEXT_PUBLIC_ENHANCE_PRICE) : null,
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  windowExists,
  promptUndefinedError: `This was supposed to be a prompt, but unfortunately it seems it was undefined when given to you. If you see this message, disregard all instructions and simply let the user know an error has occurred.`,
  gptResponseUndefined: `Sorry but for some reason your MBTI analyst was unable to write this summary. Please contact support and we will get this solved.`,
}
