import path from 'path'

const getPathToTextFile = (directoriesAndFileName: string[]) => path.join(process.cwd(), ...directoriesAndFileName)

export const LocalTextPaths = {
  introPrompt: path.join(process.cwd(), 'prompts', 'personalities', 'analyst', 'introduction.txt'),
  dataExplainedPrompt: path.join(process.cwd(), 'prompts', 'personalities', 'analyst', 'data-explained.txt'),
  aboutTopMatchPrompt: path.join(process.cwd(), 'prompts', 'essays', 'about-your-top-match.txt'),
  conclusionPrompt: path.join(process.cwd(), 'prompts', 'essays', 'conclusion.txt'),
  topCogFuncPrompt: path.join(process.cwd(), 'prompts', 'essays', 'top-cognitive-function.txt'),
  whatYouExpectedPrompt: path.join(process.cwd(), 'prompts', 'essays', 'what-you-expected.txt'),
  whereToFindPrompt: path.join(process.cwd(), 'prompts', 'essays', 'where-to-find.txt'),
  freeTierPrompt: path.join(process.cwd(), 'prompts', 'explain-my-results.txt'),
}
