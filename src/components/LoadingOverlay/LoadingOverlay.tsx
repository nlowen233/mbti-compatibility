import { ZIndex } from '@/misc/ZIndex'
import { CircularProgress } from '@mui/material'
import React from 'react'
type Props = {
  loading?: boolean
}

export const LoadingOverlay = ({ loading }: Props) => {
  return (
    <>
      {loading && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'black',
            opacity: 0.6,
            pointerEvents: 'none',
            zIndex: ZIndex.loadingOverlay,
            transition: '100ms',
          }}
        >
          <CircularProgress />
        </div>
      )}
    </>
  )
}
