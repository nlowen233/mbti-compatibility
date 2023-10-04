import fs from 'fs'

const EXP_SYS_PROMPT_PATH = '/prompts/explain-my-results.txt'

const explanationResultsSystemPrompt = () => fs.readFileSync(EXP_SYS_PROMPT_PATH, 'utf-8') //let this throw an error if it wants, it should crash at build time

export const LocalTextFiles = {
  explanationResultsSystemPrompt: explanationResultsSystemPrompt(),
}
