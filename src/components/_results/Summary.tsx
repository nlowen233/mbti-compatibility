import { Box, Typography, useTheme } from '@mui/material'
import { Interweave } from 'interweave'

type Props = {
  containerRef?: React.Ref<HTMLDivElement>
  summary?: string
  containerStyle?: React.CSSProperties
}

export const Summary = ({ containerRef, summary, containerStyle }: Props) => {
  const { palette } = useTheme()
  return (
    <Box
      ref={containerRef}
      style={{
        ...containerStyle,
      }}
    >
      <Typography variant="body1" style={{ padding: 30 }}>
        <Interweave content={summary || 'Sorry, there is no summary associated with this test'} />
      </Typography>
    </Box>
  )
}
