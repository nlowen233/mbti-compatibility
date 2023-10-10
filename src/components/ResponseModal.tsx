/* eslint-disable import/prefer-default-export */
import { ResType } from '@/types/misc'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CloseIcon from '@mui/icons-material/Close'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { Box, Dialog, IconButton, Typography, useTheme } from '@mui/material'

type Props = {
  close: () => void
  type?: ResType
  title?: string
  text?: string
}

export const ResponseModal = ({ close, text, title, type }: Props) => {
  const { palette } = useTheme()
  const Icon =
    type === 'error' ? <ErrorOutlineIcon style={{ color: palette.error.main, height: 40, width: 40 }} /> : <CheckCircleOutlineIcon />
  return (
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      onClose={close}
      open
      PaperProps={{
        sx: {
          maxWidth: 800,
          '@media (max-width: 870px)': {
            maxWidth: 600,
          },
          '@media (max-width: 650px)': {
            maxWidth: 400,
          },
          '@media (max-width: 420px)': {
            maxWidth: 250,
          },
        },
      }}
    >
      <div style={{ padding: '30px 10px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={close}>
            <CloseIcon style={{ width: 30, height: 30 }} />
          </IconButton>
        </div>
        <Box
          sx={{
            width: 750,
            '@media (max-width: 870px)': { width: 500 },
            '@media (max-width: 650px)': {
              width: 350,
            },
            '@media (max-width: 420px)': {
              width: 200,
            },
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10 }}>{Icon}</div>
          <Typography aria-label="alert-dialog-title" style={{ paddingBottom: 10 }} textAlign="center" variant="h4">
            {title}
          </Typography>
          <Typography aria-label="alert-dialog-description" color="#404040" textAlign="center" variant="body1">
            {text}
          </Typography>
        </Box>
      </div>
    </Dialog>
  )
}
