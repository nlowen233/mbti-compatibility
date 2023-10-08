import { TestUpgradeStatus } from '@/types/SQLTypes'
import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'
import { Element } from 'react-scroll'
import { ScoreNode } from '../ScoreNode'
import { Summary } from './Summary'
import { ResultsUtils } from './misc'
import { ResultsViewProps } from './types'

const CATEGORY_TITLES = ResultsUtils.CATEGORY_TITLES()
const sectionTitleStyles = ResultsUtils.sectionTitleStyles()

export const MobileResultsView = ({ ctaHref, ctaText, test }: ResultsViewProps) => {
  const isUpgraded = test?.isUpgraded === TestUpgradeStatus.upgraded
  const [page, setPage] = useState<0 | 1>(0)
  return (
    <>
      <div style={{ paddingTop: 20, display: 'flex', justifyContent: 'center' }}>
        {page === 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <div>
              {[...(test?.results || [])]
                .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
                .map((match, i) => (
                  <ScoreNode match={match} key={match.key} index={i} />
                ))}
              <div style={{ height: 80 }} />
            </div>
          </div>
        )}
        {page === 1 &&
          (isUpgraded ? (
            <div style={{ maxWidth: 800 }}>
              <Element name={CATEGORY_TITLES[0]}>
                <Typography style={sectionTitleStyles} variant="h4">
                  {CATEGORY_TITLES[0]}
                </Typography>
              </Element>
              <Summary summary={test.upgradedResponse1} />
              <Element name={CATEGORY_TITLES[1]}>
                <Typography style={sectionTitleStyles} variant="h4">
                  {CATEGORY_TITLES[1]}
                </Typography>
              </Element>
              <Summary summary={test.upgradedResponse2} />
              <Element name={CATEGORY_TITLES[2]}>
                <Typography style={sectionTitleStyles} variant="h4">
                  {CATEGORY_TITLES[2]}
                </Typography>
              </Element>
              <Summary summary={test.upgradedResponse3} />
              <Element name={CATEGORY_TITLES[3]}>
                <Typography style={sectionTitleStyles} variant="h4">
                  {CATEGORY_TITLES[3]}
                </Typography>
              </Element>
              <Summary summary={test.upgradedResponse4} />
              <Element name={CATEGORY_TITLES[4]}>
                <Typography style={sectionTitleStyles} variant="h4">
                  {CATEGORY_TITLES[4]}
                </Typography>
              </Element>
              <Summary summary={test.upgradedResponse5} containerStyle={{ paddingBottom: 100 }} />
            </div>
          ) : (
            <Summary
              summary={test?.gptResponse}
              containerStyle={{ maxWidth: 800, paddingBottom: 100 }}
              ctaHref={ctaHref}
              ctaText={ctaText}
            />
          ))}
      </div>
      <Box
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          backgroundColor: 'white',
          width: '100%',
          transition: '250ms',
        }}
        sx={{
          '@media (min-width: 1100px)': {
            opacity: 0.8,
            ':hover': {
              opacity: 1,
            },
          },
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <Button onClick={() => setPage(0)} disabled={page === 0}>
            <Typography variant="h5">Results</Typography>
          </Button>
          <Button onClick={() => setPage(1)} disabled={page === 1}>
            <Typography variant="h5">Summary</Typography>
          </Button>
        </div>
      </Box>
    </>
  )
}
