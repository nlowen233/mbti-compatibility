import { Constants } from '@/misc/Constants'
import { Question as QuestionType } from '@/types/SQLTypes'
import { RadioButtonOrder } from '@/types/misc'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { RadioButton } from './RadioButton'

type Props = {
  onSelectScore: (n: number) => void
  question?: Partial<QuestionType>
  score?: number
  questionIndex?: number
  style?: React.CSSProperties
}

export const SelectableQuestion = ({ onSelectScore, question, score, questionIndex, style }: Props) => {
  return (
    <div style={{ paddingLeft: 20, paddingRight: 20, ...style }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          '@media (max-width: 1300px)': {
            flexDirection: 'column',
          },
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          sx={{
            paddingBottom: 2,
            maxWidth: 600,
            '@media (max-width: 1300px)': {
              maxWidth: 900,
            },
          }}
        >
          {questionIndex || 0}. {question?.text}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            width: 570,
            alignItems: 'center',
            '@media (max-width: 740px)': {
              width: 430,
            },
            '@media (max-width: 490px)': {
              width: 360,
            },
            '@media (max-width: 390px)': {
              width: 250,
            },
          }}
        >
          {Array(Constants.numberOfButtonsOnScale)
            .fill(undefined)
            .map((_, i) => (
              <RadioButton onClick={() => onSelectScore(i - 3)} order={(i + 1) as RadioButtonOrder} key={i} on={score === i - 3} />
            ))}
        </Box>
      </Box>
    </div>
  )
}
