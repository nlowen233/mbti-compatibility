import { ResType } from '@/types/misc'
import React, { Dispatch } from 'react'

export interface PopUpMessage {
    title: string
    message: string
    type: ResType
}

export interface PopUpContextShape {
    pushPopUpMessage: (msg: PopUpMessage) => void
    popUpMessage: PopUpMessage|undefined
}

export const PopUpContext = React.createContext<PopUpContextShape>({
    pushPopUpMessage: () => {},
    popUpMessage: undefined,
})
