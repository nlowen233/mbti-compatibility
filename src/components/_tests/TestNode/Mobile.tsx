import { Paths } from '@/misc/Paths'
import { Utils } from '@/misc/Utils'
import { TestStatus } from '@/types/SQLTypes'
import CheckIcon from '@mui/icons-material/Check'
import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material'
import { TestsPageUtils } from '../misc'
import { TestNodeProps } from '../types'

export const Mobile = ({ test, amountOfQuestions }: TestNodeProps) => {
  const { palette } = useTheme()
  const testFinished = test?.status === TestStatus.Finished
  const getCompletionScore = () => {
    if (testFinished) {
      return 1
    }
    let score = 0
    try {
      score = (test?.answers?.length || 0) / (amountOfQuestions || 0)
    } catch (e) {}
    return score
  }
  const score = getCompletionScore()
  const topResults = test?.results?.slice(0, 3)
  const buttonText = TestsPageUtils.testStatusToButtonText(test?.status || 0)
  const progressScore = score * 100
  return (
    <Box
      style={{
        padding: 10,
        maxWidth: 800,
        width: '100%',
        border: `1px solid ${palette.divider}`,
        borderRadius: 10,
        marginBottom: 10,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          '@media (max-width: 330px)': {
            flexDirection: 'column',
          },
        }}
      >
        <div>
          <Typography paddingRight={3} variant={'h5'} fontWeight={'bold'}>
            Created At:
          </Typography>
          <Typography paddingRight={3} variant={'h5'}>
            {Utils.displayDateTime(test?.createdAt)}
          </Typography>
          <div style={{ display: 'flex', alignItems: 'center', paddingTop: 6 }}>
            {test?.status === TestStatus.Finished ? (
              <>
                <Typography paddingRight={1} variant={'h4'}>
                  Completed
                </Typography>
                <CheckIcon fontSize="large" />
              </>
            ) : (
              <>
                <Typography paddingRight={1} variant={'h4'}>
                  {progressScore > 0 ? 'Progress' : 'New'}
                </Typography>
                {progressScore > 0 && (
                  <div style={{ position: 'relative' }}>
                    <CircularProgress variant="determinate" value={progressScore} size={'2.4rem'} />
                    <div
                      style={{
                        position: 'absolute',
                        top: '25%',
                        left: '30%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant="body2">{progressScore}</Typography>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div>
          {topResults?.map(({ compatibilityScore, key }, i) => (
            <div key={key} style={{ display: 'flex' }}>
              <Typography paddingRight={3} variant={TestsPageUtils.indexToVariant(i)}>
                {key}
              </Typography>
              <Typography variant={TestsPageUtils.indexToVariant(i)}>{Utils.toPercentage(compatibilityScore)}</Typography>
            </div>
          ))}
        </div>
      </Box>
      <div>
        <Button variant="contained" href={testFinished ? `${Paths.results}/${test.id}` : Paths.test} fullWidth style={{ marginTop: 10 }}>
          {buttonText}
        </Button>
      </div>
    </Box>
  )
}
