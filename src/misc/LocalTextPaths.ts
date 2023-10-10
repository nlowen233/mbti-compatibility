import path from 'path'

const getPathToTextFile = (directoriesAndFileName: string[]) => path.join(process.cwd(), ...directoriesAndFileName)

export const LocalTextPaths = {
  introPrompt: getPathToTextFile(['prompts', 'personalities', 'analyst', 'introduction.txt']),
  dataExplainedPrompt: getPathToTextFile(['prompts', 'personalities', 'analyst', 'data-explained.txt']),
  aboutTopMatchPrompt: getPathToTextFile(['prompts', 'essays', 'about-your-top-match.txt']),
  conclusionPrompt: getPathToTextFile(['prompts', 'essays', 'conclusion.txt']),
  topCogFuncPrompt: getPathToTextFile(['prompts', 'essays', 'top-cognitive-function.txt']),
  whatYouExpectedPrompt: getPathToTextFile(['prompts', 'essays', 'what-you-expected.txt']),
  whereToFindPrompt: getPathToTextFile(['prompts', 'essays', 'where-to-find.txt']),
  freeTierPrompt: getPathToTextFile(['prompts', 'explain-my-results.txt']),
}
