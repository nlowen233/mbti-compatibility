import { SxProps, Theme } from '@mui/material'

const functionGrid = (): SxProps<Theme> => ({
  gridTemplateColumns: 'repeat(8, 1fr)',
  display: 'grid',
  '@media (max-width: 1100px)': {
    gridTemplateColumns: 'repeat(4, 1fr)',
  },
  '@media (max-width: 540px)': {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  '@media (max-width: 280px)': {
    gridTemplateColumns: '1fr',
    justifyItems: 'center',
  },
})

export const Styles = {
  functionGrid,
}
