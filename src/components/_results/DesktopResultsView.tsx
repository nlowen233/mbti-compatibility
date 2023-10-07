import { Box } from '@mui/material'
import { ScoreNode } from '../ScoreNode'
import { Summary } from './Summary'
import { ResultsViewProps } from './types'

export const DesktopResultsView = ({ nodes, summary }: ResultsViewProps) => {
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
