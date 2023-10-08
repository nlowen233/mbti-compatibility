import { TestUpgradeStatus } from '@/types/SQLTypes'
import { Box, Typography, useTheme } from '@mui/material'
import { Element, Link } from 'react-scroll'
import { ScoreNode } from '../ScoreNode'
import { Summary } from './Summary'
import { ResultsUtils } from './misc'
import { ResultsViewProps } from './types'

const CATEGORY_TITLES = ResultsUtils.CATEGORY_TITLES()
const sectionTitleStyles = ResultsUtils.sectionTitleStyles()

export const DesktopResultsView = ({ ctaHref, ctaText, test }: ResultsViewProps) => {
  const isUpgraded = test?.isUpgraded === TestUpgradeStatus.upgraded
  const { palette } = useTheme()
  return (
    <div style={{ display: 'flex', paddingTop: 20, paddingBottom: 20, position: 'relative' }}>
      <Box
        sx={{
          height: '80vh',
          minWidth: 500,
          overflowY: 'auto',
          minHeight: 600,
          position: 'sticky',
          top: 100,
          left: 0,
        }}
        style={{ marginRight: 10 }}
      >
        {[...(test?.results || [])]
          .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
          .map((match, i) => (
            <ScoreNode match={match} key={match.key} index={i} />
          ))}
      </Box>
      {!isUpgraded ? (
        <Summary summary={test?.gptResponse} containerStyle={{ maxWidth: 800 }} ctaHref={ctaHref} ctaText={ctaText} />
      ) : (
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
          <Summary summary={test.upgradedResponse5} />
        </div>
      )}
      {isUpgraded && (
        <Box
          sx={{
            height: '100%',
            minWidth: 300,
            position: 'sticky',
            top: 100,
            left: 0,
            '& .MuiTypography-root': {
              paddingBottom: 2,
            },
          }}
          style={{ marginRight: 10 }}
        >
          <div
            style={{
              borderLeft: `1px solid ${palette.divider}`,
              paddingLeft: 10,
            }}
          >
            {CATEGORY_TITLES.map((title) => (
              <Link key={title} to={title} smooth duration={400}>
                <Link key={title} to={title} smooth duration={400}>
                  <Typography
                    sx={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      ':hover': {
                        color: palette.primary.light,
                      },
                    }}
                  >
                    {title}
                  </Typography>
                </Link>
              </Link>
            ))}
          </div>
        </Box>
      )}
    </div>
  )
}
