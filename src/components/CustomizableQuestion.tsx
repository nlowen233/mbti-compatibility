import { Constants } from '@/misc/Constants'
import { Styles } from '@/misc/Styles'
import { Question, Scores } from '@/types/SQLTypes'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { Box, TextField, useTheme } from '@mui/material'
import React from 'react'
import { FormSelect } from './FormSelect'

type ScoreObject = {
  functionName: string
  score: number
}

type Props = {
  question?: Partial<Question>
  onChangeText: (s: string) => void
  onChangeScore: (key: keyof Scores, n: number) => void
  style?: React.CSSProperties
  serverDifference?: boolean
}

const scores = Constants.Scores()
const grid = Styles.functionGrid()

const _CustomizableQuestion = ({ onChangeScore, onChangeText, question, style, serverDifference }: Props) => {
  const { palette } = useTheme()
  const scoreArray: ScoreObject[] = !!question?.scores
    ? //@ts-ignore
      Object.keys(question?.scores).map((key) => ({ functionName: key, score: question.scores[key] }))
    : []
  return (
    <div style={{ display: 'flex', justifyContent: 'center', ...style }}>
      <div style={{ width: '80%' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <TextField
            id="outlined-multiline-flexible"
            multiline
            maxRows={6}
            value={question?.text || ''}
            onChange={(e) => onChangeText(e.target.value)}
            style={{ width: '100%', padding: 5 }}
            label={question?.id}
          />
          {!!serverDifference && (
            <div style={{ position: 'absolute', top: 0, right: -30 }} title="Not saved">
              <WarningAmberIcon style={{ color: palette.warning.main }} />
            </div>
          )}
        </div>
        <Box sx={{ flex: 1, ...grid }}>
          {scoreArray.map(({ functionName, score }) => (
            <div key={functionName} style={{ display: 'flex', alignItems: 'center' }}>
              <FormSelect
                onChange={(n) => onChangeScore(functionName as keyof Scores, n || 0)}
                value={score}
                options={scores}
                style={{ width: 100 }}
                label={functionName}
              />
            </div>
          ))}
        </Box>
      </div>
    </div>
  )
}

export const CustomizableQuestion = React.memo(_CustomizableQuestion)
