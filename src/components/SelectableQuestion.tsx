import { Question as QuestionType } from '@/types/SQLTypes'
import React from 'react'
import { Typography } from '@mui/material'
import { RadioButton } from './RadioButton'
import { RadioButtonOrder } from '@/types/misc'

type Props = {
  onSelectScore: (n: number) => void
  question?: Partial<QuestionType>
  score?: number
  questionIndex?: number
  style?: React.CSSProperties
}

export const SelectableQuestion = ({ onSelectScore, question, score,questionIndex,style }: Props) => {
  return (
    <div style={{paddingLeft:20,paddingRight:20,...style}}>
      <Typography variant="h4" textAlign="center" style={{ paddingBottom: 10 }}>
        {questionIndex||0}. {question?.text}
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', width: 630,alignItems:'center' }}>
          {Array(7)
            .fill(undefined)
            .map((_, i) => (
              <RadioButton onClick={() => onSelectScore(i - 3)} order={i+1 as RadioButtonOrder} key={i} on={score === i - 3} />
            ))}
        </div>
      </div>
    </div>
  )
}
