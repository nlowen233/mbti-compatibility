import { Box, Button, Typography } from '@mui/material'
import { useState } from 'react'
import { ScoreNode } from '../ScoreNode'
import { Summary } from './Summary'
import { ResultsViewProps } from './types'

export const MobileResultsView = ({ nodes, summary }: ResultsViewProps) => {
  const [page, setPage] = useState<0 | 1>(0)
  return (
    <>
      <div style={{ paddingTop: 20, display: 'flex', justifyContent: 'center', height: '100%' }}>
        {page === 0 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              overflowY: 'auto',
              height: '90%',
            }}
          >
            <div>
              {[...nodes]
                .sort((a, b) => b.compatibilityScore - a.compatibilityScore)
                .map((match, i) => (
                  <ScoreNode match={match} key={match.key} index={i} />
                ))}
              <div style={{ height: 80 }} />
            </div>
          </div>
        )}
        {page === 1 && (
          <Summary summary={summary} containerStyle={{ height: '90%', overflowY: 'auto', maxWidth: 800, paddingBottom: 80 }} />
        )}
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
