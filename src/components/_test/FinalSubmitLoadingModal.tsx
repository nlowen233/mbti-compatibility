/* eslint-disable import/prefer-default-export */
import { Box, CircularProgress, Dialog, Typography } from '@mui/material'

export const FinalSubmitLoadingModal = () => {
  return (
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      open
      PaperProps={{
        style: {
          maxWidth: 800,
          borderRadius: 0,
        },
      }}
    >
      <div style={{ padding: 10 }}>
        <Box
          sx={{
            padding: '30px 150px',
            '@media (max-width: 870px)': {
              padding: '20px 20px',
            },
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10 }}>
            <CircularProgress />
          </div>
          <Typography aria-label="alert-dialog-title" style={{ paddingBottom: 10 }} textAlign="center" variant="h4" maxWidth={400}>
            {'Submitting your test, generating results'}
          </Typography>
          <Typography aria-label="alert-dialog-description" color="#404040" textAlign="center" variant="body1" maxWidth={400}>
            {`Our AI MBTI expert is combing through your answers and generating your summary, so this may take a minute...`}
          </Typography>
        </Box>
      </div>
    </Dialog>
  )
}
