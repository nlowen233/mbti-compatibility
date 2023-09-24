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
      open={!!open}
      PaperProps={{
        style: {
          maxWidth: 800,
          borderRadius: 0,
        },
      }}
    >
      <div style={{ padding: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton onClick={close}>
            <CloseIcon style={{ width: 30, height: 30 }} />
          </IconButton>
        </div>
        <Box
          sx={{
            padding: '30px 150px',
            '@media (max-width: 870px)': {
              padding: '5px 20px',
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
