import { RadioButtonOrder } from '@/types/misc'
import React from 'react'
import { useMediaQuery, Box } from '@mui/material'

type Props = {
  onClick: () => void
  on?: boolean
  order: RadioButtonOrder
  disabled?: boolean
}

const convertRadioButtonOrderToColor = (order: RadioButtonOrder): string => {
  switch (order) {
    case 1:
      return '#FF5733'
    case 2:
      return '#FF7F50'
    case 3:
      return '#FFA07A'
    case 4:
      return '#FFD700'
    case 5:
      return '#A9DFBF'
    case 6:
      return '#7DCEA0'
    case 7:
      return '#5FAC8C'
    default:
      return ''
  }
}

export const RadioButton = ({ onClick, on, order, disabled }: Props) => {
  return (
    <Box
      onClick={onClick}
      role="button"
      style={{
        backgroundColor: disabled ? 'lightgray' : 'white',
        borderRadius: 30,
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      sx={{
        height: 40,
        width: 40,
        '@media (max-width: 420px)': {
          height: 30,
          width: 30,
        },
        '@media (max-width: 330px)': {
          height: 20,
          width: 20,
        },
      }}
    >
      {!!on && (
        <div
          style={{
            width: '80%',
            height: '80%',
            borderRadius: 30,
            backgroundColor: convertRadioButtonOrderToColor(order),
          }}
        />
      )}
    </Box>
  )
}
