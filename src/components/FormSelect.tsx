/* eslint-disable import/prefer-default-export */
import { Option } from '@/types/misc'
import { MenuItem, Select, Typography } from '@mui/material'
import React from 'react'

type Props<OptionType extends string | number> = {
  label?: string
  onChange: (s: OptionType | undefined) => void
  value: OptionType | undefined
  placeholder?: string
  style?: React.CSSProperties
  options?: Option<OptionType>[]
}

export function FormSelect<OptionType extends string | number>({ label, onChange, value, placeholder, style, options }: Props<OptionType>) {
  return (
    <div style={style}>
      {!!label && (
        <Typography fontWeight="bold" style={{ paddingBottom: 5 }} variant="subtitle1">
          {label}
        </Typography>
      )}
      <Select
        placeholder={placeholder}
        value={value || ''}
        onChange={(e) => onChange(e.target.value as OptionType)}
        style={{ width: '100%' }}
      >
        {options?.map((op) => (
          <MenuItem key={op.value} value={op.value}>
            {op.display}
          </MenuItem>
        ))}
      </Select>
    </div>
  )
}
