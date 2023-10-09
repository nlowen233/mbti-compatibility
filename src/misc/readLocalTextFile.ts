import { APIRes } from '@/types/misc'
import fs from 'fs/promises'
import { LocalTextPaths } from './LocalTextPaths'

export const readLocalTextFile = async (path: keyof typeof LocalTextPaths): Promise<APIRes<string>> => {
  let res: string | undefined
  let error: string | undefined
  try {
    res = await fs.readFile(LocalTextPaths[path], 'utf-8')
  } catch (err) {
    error = err as string
  }
  return { err: !!error, message: error, res }
}
