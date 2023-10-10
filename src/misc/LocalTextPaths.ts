import { Utils } from './Utils'

export const LocalTextPaths = {
  introPrompt: Utils.getPathToTextFile(['prompts', 'personalities', 'analyst', 'introduction.txt']),
  dataExplainedPrompt: Utils.getPathToTextFile(['prompts', 'personalities', 'analyst', 'data-explained.txt']),
  aboutTopMatchPrompt: Utils.getPathToTextFile(['prompts', 'essays', 'about-your-top-match.txt']),
  conclusionPrompt: Utils.getPathToTextFile(['prompts', 'essays', 'conclusion.txt']),
  topCogFuncPrompt: Utils.getPathToTextFile(['prompts', 'essays', 'top-cognitive-function.txt']),
  whatYouExpectedPrompt: Utils.getPathToTextFile(['prompts', 'essays', 'what-you-expected.txt']),
  whereToFindPrompt: Utils.getPathToTextFile(['prompts', 'essays', 'where-to-find.txt']),
  freeTierPrompt: Utils.getPathToTextFile(['prompts', 'explain-my-results.txt']),
}
