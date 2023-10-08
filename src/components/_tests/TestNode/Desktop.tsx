import { Paths } from '@/misc/Paths'
import { Utils } from '@/misc/Utils'
import { TestStatus, TestUpgradeStatus } from '@/types/SQLTypes'
import CheckIcon from '@mui/icons-material/Check'
import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material'
import { TestsPageUtils } from '../misc'
import { TestNodeProps } from '../types'

export const Desktop = ({ test, amountOfQuestions }: TestNodeProps) => {
  const { palette } = useTheme()
  const testFinished = test?.status === TestStatus.Finished
  const isUpgraded = test?.isUpgraded === TestUpgradeStatus.upgraded
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
  const topResults = [...(test?.results || [])].sort((a, b) => b.compatibilityScore - a.compatibilityScore).slice(0, 3)
  const buttonText = TestsPageUtils.testStatusToButtonText(test?.status || 0, test?.isUpgraded)
  const progressScore = score * 100
  return (
    <Box
      sx={{
        borderBottom: `1px solid ${palette.divider}`,
        display: 'grid',
        width: '100%',
        gridTemplateColumns: '6fr 5fr 5fr 5fr',
        alignItems: 'center',
      }}
      style={{
        padding: 10,
        maxWidth: 1200,
      }}
    >
      <div>
        <Typography paddingRight={3} variant={'h5'} fontWeight={'bold'}>
          Created At:
        </Typography>
        <Typography paddingRight={3} variant={'h5'}>
          {Utils.displayDateTime(test?.createdAt)}
        </Typography>
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {testFinished ? (
          <>
            <Typography paddingRight={3} variant={'h4'}>
              Completed
            </Typography>
            <CheckIcon fontSize="large" />
          </>
        ) : (
          <>
            <Typography paddingRight={3} variant={'h4'}>
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
      <div>
        <Button variant="contained" href={testFinished ? `${Paths.results}/${test.id}` : Paths.test} fullWidth>
          {buttonText}
        </Button>
        {testFinished && !isUpgraded && (
          <Button variant="outlined" href={`${Paths.results}/upgrade/${test.id}`} fullWidth style={{ marginTop: 20 }}>
            Get Full Analysis
          </Button>
        )}
      </div>
    </Box>
  )
}
