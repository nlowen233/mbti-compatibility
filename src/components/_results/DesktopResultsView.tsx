import { Box } from '@mui/material'
import { ScoreNode } from '../ScoreNode'
import { Summary } from './Summary'
import { ResultsViewProps } from './types'

export const DesktopResultsView = ({ nodes, summary }: ResultsViewProps) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 20, paddingBottom: 20, height: '95%' }}>
      <Box
        sx={{
          height: '100%',
          minWidth: 500,
          overflowY: 'auto',
        }}
        style={{ marginRight: 10 }}
      >
        {[...nodes]
          .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
          .map((match, i) => (
            <ScoreNode match={match} key={match.key} index={i} />
          ))}
      </Box>
      <Summary summary={summary} containerStyle={{ height: '100%', overflowY: 'auto', flex: 1, maxWidth: 800 }} />
    </div>
  )
}
