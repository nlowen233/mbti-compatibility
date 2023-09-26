import { Constants } from '@/misc/Constants'
import { Box, Typography } from '@mui/material'
import { MBTIScoreData, ResultsUtils } from './_results/misc'

const mbtis = Constants.MBTIArray()

type Props = {
  match?: MBTIScoreData
  index?: number
}

export const ScoreNode = ({ match, index }: Props) => {
  const score = (match?.compatibilityScore || 0) * 100
  const mbti = mbtis.find((mbti) => mbti.name === match?.key)
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        padding: 2,
        '@media (max-width: 370px)': {
          padding: 1,
        },
      }}
    >
      <Box
        sx={{
          width: '80%',
          display: 'flex',
          justifyContent: 'flex-start',
          '@media (max-width: 370px)': {
            justifyContent: 'center',
          },
        }}
      >
        <div style={{ paddingRight: 30 }}>{Number.isInteger(index) && <Typography variant="h1">{(index as number) + 1}.</Typography>}</div>
        <div style={{ paddingRight: 10 }}>
          <Typography variant="h2">{match?.key}</Typography>
          <Typography variant="h3">{score.toFixed(0)}%</Typography>
        </div>
        {!!mbti && (
          <div>
            {match?.vector.map((func, i) => (
              <div key={i} style={{ display: 'flex' }}>
                <Typography variant="h5" fontWeight="bold" style={{ paddingRight: 10 }}>
                  {mbti[ResultsUtils.arrayIndexToFunctionName(i)]}:
                </Typography>
                <Typography variant="h5">{(func * 100).toFixed(0)}%</Typography>
              </div>
            ))}
          </div>
        )}
      </Box>
    </Box>
  )
}
