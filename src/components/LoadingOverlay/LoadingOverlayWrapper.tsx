import React, { useState, use } from 'react'
import { LoadingOverlay } from './LoadingOverlay'
import { LoadingOverlayContext } from '../../contexts/LoadingOverlayContext'

type Props = {
    children?: React.ReactNode
    on: boolean
    toggle: (b: boolean) => void
}

export const LoadingOverlayWrapper = ({ children, on, toggle }: Props) => {
    return (
        <LoadingOverlayContext.Provider value={{ on, toggle }}>
            <LoadingOverlay loading={on} />
            {children}
        </LoadingOverlayContext.Provider>
    )
}
