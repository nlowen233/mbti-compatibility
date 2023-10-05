// This code is for v4 of the openai package: npmjs.com/package/openai
import { MBTIScoreData, ScoreNode } from '@/components/_results/misc'
import { User } from '@/types/SQLTypes'
import { APIRes } from '@/types/misc'
import _OpenAI from 'openai'
import { ChatCompletion } from 'openai/resources/chat/index.mjs'
import { Constants } from './Constants'
import { LocalTextFiles } from './LocalTextFiles'

const openai = new _OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const getResultsExplanation = async (user: User, scores: ScoreNode[], results: MBTIScoreData[]): Promise<APIRes<ChatCompletion>> => {
  let res: ChatCompletion | undefined
  let error
  try {
    res = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: LocalTextFiles.explanationResultsSystemPrompt,
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

export const OpenAI = {
  getResultsExplanation,
}
