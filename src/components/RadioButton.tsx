import { RadioButtonOrder } from '@/types/misc'
import { Box } from '@mui/material'

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
  const orderSizeMultiplier = Math.abs(4 - order) / 8 + 1
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
        height: 36 * orderSizeMultiplier,
        width: 36 * orderSizeMultiplier,
        '@media (max-width: 420px)': {
          height: 26 * orderSizeMultiplier,
          width: 26 * orderSizeMultiplier,
        },
        '@media (max-width: 330px)': {
          height: 20 * orderSizeMultiplier,
          width: 20 * orderSizeMultiplier,
        },
      }}
    >
      {!!on && (
        <div
          style={{
            width: '70%',
            height: '70%',
            borderRadius: 30,
            backgroundColor: convertRadioButtonOrderToColor(order),
          }}
        />
      )}
    </Box>
  )
}
