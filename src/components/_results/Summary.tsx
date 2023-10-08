import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { Box, Button, Typography, useTheme } from '@mui/material'
import { Interweave } from '../Interweave'

type Props = {
  containerRef?: React.Ref<HTMLDivElement>
  summary?: string
  containerStyle?: React.CSSProperties
  ctaText?: string
  ctaHref?: string
  scrollTargetID?: string
}

export const Summary = ({ containerRef, summary, containerStyle, ctaText, ctaHref }: Props) => {
  const { palette } = useTheme()
  return (
    <Box
      ref={containerRef}
      style={{
        paddingBottom: 30,
        paddingLeft: 30,
        paddingRight: 30,
        ...containerStyle,
      }}
    >
      <Typography variant="body1">
        <Interweave content={summary || 'Sorry, there is no summary associated with this test'} />
      </Typography>
      {!!ctaHref && (
        <Button href={ctaHref} style={{ marginTop: 10 }}>
          <div>{ctaText}</div>
          <ArrowForwardIcon />
        </Button>
      )}
    </Box>
  )
}
