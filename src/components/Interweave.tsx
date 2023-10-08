import { Interweave as I } from 'interweave'
import { useEffect, useState } from 'react'

type Props = {
  content: string
}

export const Interweave = ({ content }: Props) => {
  const [willFormat, setWillFormat] = useState(false)
  useEffect(() => {
    setWillFormat(true)
  }, [])
  return !willFormat ? <>{content}</> : <I content={content} />
}
