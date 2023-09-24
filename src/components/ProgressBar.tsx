import React from 'react';
import { useTheme } from '@mui/material';

const getProgress = (step: number, numberSteps: number) => {
  const result = (1 / (numberSteps + 1)) * step * 100;
  return `${result}%`;
};

type Props = {
  step: number;
  numberSteps: number;
};

export const ProgressBar = ({ step, numberSteps }: Props) => {
  const { palette } = useTheme();
  return (
    <div style={{ width: '100%', backgroundColor: '#959ba5', height: 5 }}>
      <div
        style={{ backgroundColor: palette.secondary.dark, width: getProgress(step, numberSteps), transition: '250ms', height: '100%' }}
      />
    </div>
  );
};
