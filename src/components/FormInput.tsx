/* eslint-disable import/prefer-default-export */
import React from 'react';
import { Input, Typography, useTheme } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

type Props = {
  label?: string;
  onChange: (s: string) => void;
  value: string;
  placeholder?: string;
  style?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  autoComplete?: string;
  errorMessage?: string;
  hasError?: boolean;
};

export const FormInput = ({ label, onChange, value, placeholder, style, inputStyle, autoComplete, errorMessage, hasError }: Props) => {
  const {palette} = useTheme();
  const errorStyles: React.CSSProperties = hasError ? { outline: `1px solid ${palette.error.main}` } : {};
  return (
    <div
      style={style}
    >
      {!!label && (
        <Typography fontWeight="bold" style={{ paddingBottom: 5 }} variant="subtitle1">
          {label}
        </Typography>
      )}
      <Input
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: '100%', ...inputStyle, ...errorStyles,height: 56 }}
        value={value}
      />
      {!!hasError && !!errorMessage && (
        <div style={{ display: 'flex', alignItems: 'center', paddingTop: 3 }}>
          <ErrorOutlineIcon style={{paddingRight:5,height:30,width:30}}/>
          <Typography color={palette.error.main} variant="body1">
            {errorMessage}
          </Typography>
        </div>
      )}
    </div>
  );
};
