import { NextApiRequest } from 'next'

const getRawBody = (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      resolve(data)
    })
    req.on('error', (error) => {
      reject(error)
    })
  })
}

export const APIUtils = {
  getRawBody,
}
