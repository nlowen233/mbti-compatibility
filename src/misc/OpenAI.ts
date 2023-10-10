// This code is for v4 of the openai package: npmjs.com/package/openai
import { MBTIScoreData, ScoreNode } from '@/components/_results/misc'
import { User } from '@/types/SQLTypes'
import { APIRes, AnalystResponse, ExecuteConversationParams, GetGPTEssayParams, GetNextGPTParams } from '@/types/misc'
import _OpenAI from 'openai'
import { ChatCompletion, ChatCompletionMessage } from 'openai/resources/chat/index.mjs'
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
    dataExplainedPromptKey: 'dataExplainedPrompt',
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
  dataExplainedPromptKey,
  introPromptKey,
  essayPromptKey,
  userDataPrompt,
}: GetGPTEssayParams): Promise<APIRes<string>> => {
  const [dataExplainedFileRes, introFileRes, essayFileRes] = await Promise.all([
    readLocalTextFile(dataExplainedPromptKey),
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
      model: 'gpt-3.5-turbo-16k',
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

const getNextResponse = ({
  conversationArray,
  nextChat,
  expGrowthRate = 2,
  initialBackoff = 0,
  model,
  maxAttempts = 10,
}: GetNextGPTParams) =>
  new Promise<APIRes<ChatCompletionMessage[]>>((res) => {
    let executions = 0
    const getNextChat = () => {
      executions += 1
      return openai.chat.completions.create({
        model: model || 'gpt-3.5-turbo-16k',
        messages: [...conversationArray, nextChat],
        temperature: 1,
        max_tokens: 1200,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      })
    }
    getNextChat()
      .then((gptRes) => {
        res({
          err: false,
          res: [...conversationArray, nextChat, { role: 'assistant', content: gptRes?.choices[0].message.content }],
        })
      })
      .catch((err) => {
        console.log(err)
        if (executions >= maxAttempts) {
          res({
            err: true,
            message: 'Max attempts exceeded, exponential backoff will cease',
          })
        } else if (err?.status === 429) {
          setTimeout(getNextChat, Math.pow(executions, expGrowthRate) + initialBackoff)
        } else {
          res({
            err: true,
            message: err as string,
          })
        }
      })
  })

const executeConversation = async ({
  initialConversation,
  nextChats,
  expGrowthRate,
  initialBackoff,
  maxAttempts,
  model,
}: ExecuteConversationParams): Promise<APIRes<string[]>> => {
  let conversation = initialConversation
  let gptResponses: string[] = []
  let error: string | undefined
  for (const chat of nextChats) {
    const nextResponseRes = await getNextResponse({
      conversationArray: conversation,
      nextChat: chat,
      expGrowthRate,
      initialBackoff,
      maxAttempts,
      model,
    })
    if (nextResponseRes.err) {
      error = nextResponseRes.message || Constants.unknownError
      break
    }
    if (!nextResponseRes.res) {
      error = 'getNextResponse did not throw an error, but had a falsy response'
      break
    }
    conversation = nextResponseRes.res
    const lastChatParam = conversation[conversation.length - 1]
    const lastChat = lastChatParam.content
    gptResponses.push(lastChat || Constants.unknownError)
  }
  return {
    err: !!error,
    message: error,
    res: gptResponses,
  }
}

const getFullAnalysis = async (user: User, scores: ScoreNode[], results: MBTIScoreData[]): Promise<APIRes<AnalystResponse>> => {
  const userDataPrompt = Constants.explainResultsPromptTemplate(user, scores, results)
  const localFilRes = await Promise.all([
    readLocalTextFile('introPrompt'),
    readLocalTextFile('dataExplainedPrompt'),
    readLocalTextFile('aboutTopMatchPrompt'),
    readLocalTextFile('topCogFuncPrompt'),
    readLocalTextFile('whereToFindPrompt'),
    readLocalTextFile('whatYouExpectedPrompt'),
    readLocalTextFile('conclusionPrompt'),
  ])
  if (localFilRes.some((apiRes) => apiRes.err)) {
    return {
      err: true,
      message: localFilRes
        .filter((apiRes) => apiRes.err)
        .map((apiRes) => apiRes.message)
        .join(','),
    }
  }
  const prompts = localFilRes.map((apiRes) => apiRes.res) as string[]
  const conversationRes = await executeConversation({
    initialConversation: [
      {
        role: 'system',
        content: `${prompts[0]}\n\n]n${prompts[1]}\n\n${userDataPrompt}`,
      },
    ],
    nextChats: prompts.slice(2).map((essay) => ({ content: essay, role: 'user' })),
    model: 'gpt-4',
  })
  if (conversationRes.err) {
    return {
      err: conversationRes.err,
      message: conversationRes.message,
    }
  }
  const gptResponses = conversationRes.res?.length ? conversationRes.res : []
  return {
    err: false,
    res: {
      aboutTopMatch: gptResponses[0],
      topCognitiveFunction: gptResponses[1],
      whereToFind: gptResponses[2],
      whatYouExpected: gptResponses[3],
      conclusion: gptResponses[4],
    },
  }
}

export const OpenAI = {
  getResultsExplanation,
  getAnalystFullExplanation,
  getFullAnalysis,
}
