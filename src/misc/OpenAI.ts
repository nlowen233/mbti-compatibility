// This code is for v4 of the openai package: npmjs.com/package/openai
import { MBTIScoreData, ScoreNode } from '@/components/_results/misc'
import { User } from '@/types/SQLTypes'
import { APIRes, AnalystResponse, GetGPTEssayParams } from '@/types/misc'
import _OpenAI from 'openai'
import { ChatCompletion } from 'openai/resources/chat/index.mjs'
import { Constants } from './Constants'
import { readLocalTextFile } from './readLocalTextFile'

const openai = new _OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const getResultsExplanation = async (user: User, scores: ScoreNode[], results: MBTIScoreData[]): Promise<APIRes<ChatCompletion>> => {
  let res: ChatCompletion | undefined
  let error
  const systemPromptRes = await readLocalTextFile('freeTierPrompt')
  if (systemPromptRes.err || !systemPromptRes.res) {
    return {
      err: true,
      message: 'There was an error reading the prompt file from local storage',
    }
  }
  try {
    res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPromptRes.res,
        },
        {
          role: 'user',
          content: Constants.explainResultsPromptTemplate(user, scores, results),
        },
      ],
      temperature: 0.61,
      max_tokens: 1024,
      top_p: 1,
      frequency_penalty: 0.43,
      presence_penalty: 0.2,
    })
  } catch (err) {
    error = err
  }
  return {
    message: error as string,
    res,
    err: !!error,
  }
}

const getAnalystFullExplanation = async (user: User, scores: ScoreNode[], results: MBTIScoreData[]): Promise<APIRes<AnalystResponse>> => {
  const userDataPrompt = Constants.explainResultsPromptTemplate(user, scores, results)
  const partialParams: Partial<GetGPTEssayParams> = {
    dataExplainedPropmptKey: 'dataExplainedPrompt',
    introPromptKey: 'introPrompt',
    userDataPrompt,
  }
  const [aboutTopMatchRes, topCogFuncRes, whatYouExpectedRes, whereToFindRes, conclusionRes] = await Promise.all([
    getEssay({ ...partialParams, essayPromptKey: 'aboutTopMatchPrompt' } as GetGPTEssayParams),
    getEssay({ ...partialParams, essayPromptKey: 'topCogFuncPrompt' } as GetGPTEssayParams),
    getEssay({ ...partialParams, essayPromptKey: 'whatYouExpectedPrompt' } as GetGPTEssayParams),
    getEssay({ ...partialParams, essayPromptKey: 'whereToFindPrompt' } as GetGPTEssayParams),
    getEssay({ ...partialParams, essayPromptKey: 'conclusionPrompt' } as GetGPTEssayParams),
  ])
  if (aboutTopMatchRes.err || topCogFuncRes.err || whatYouExpectedRes.err || whereToFindRes.err) {
    return {
      err: true,
      message:
        aboutTopMatchRes.message ||
        topCogFuncRes.message ||
        whatYouExpectedRes.message ||
        whatYouExpectedRes.message ||
        Constants.unknownError,
    }
  }
  return {
    err: false,
    res: {
      aboutTopMatch: aboutTopMatchRes.res || Constants.gptResponseUndefined,
      conclusion: conclusionRes.res || Constants.gptResponseUndefined,
      topCognitiveFunction: topCogFuncRes.res || Constants.gptResponseUndefined,
      whatYouExpected: whatYouExpectedRes.res || Constants.gptResponseUndefined,
      whereToFind: whereToFindRes.res || Constants.gptResponseUndefined,
    },
  }
}

const getEssay = async ({
  dataExplainedPropmptKey,
  introPromptKey,
  essayPromptKey,
  userDataPrompt,
}: GetGPTEssayParams): Promise<APIRes<string>> => {
  const [dataExplainedFileRes, introFileRes, essayFileRes] = await Promise.all([
    readLocalTextFile(dataExplainedPropmptKey),
    readLocalTextFile(introPromptKey),
    readLocalTextFile(essayPromptKey),
  ])

  if (dataExplainedFileRes.err || introFileRes.err || essayFileRes.err) {
    return {
      err: true,
      message: `There was an error reading the prompt file from local storage: ${
        dataExplainedFileRes.message || introFileRes.message || essayFileRes.message
      }`,
    }
  }
  const combinedSystemPrompt = `${introFileRes.res || Constants.promptUndefinedError}\n\n\n${
    dataExplainedFileRes.res || Constants.promptUndefinedError
  }`
  const combinedUserPrompt = `${userDataPrompt}\n\n\n${essayFileRes.res || Constants.promptUndefinedError}`
  let gptRes: ChatCompletion | undefined
  let gptError: string | undefined
  try {
    gptRes = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: combinedSystemPrompt,
        },
        {
          role: 'user',
          content: combinedUserPrompt,
        },
      ],
      temperature: 1,
      max_tokens: 1200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })
  } catch (err) {
    gptError = err as string
  }
  return {
    err: !!gptError,
    message: gptError,
    res: gptRes?.choices[0].message.content,
  }
}

export const OpenAI = {
  getResultsExplanation,
  getAnalystFullExplanation,
}
