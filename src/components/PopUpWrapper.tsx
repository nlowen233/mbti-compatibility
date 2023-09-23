import { PopUpContext, PopUpMessage } from '@/contexts/PopUpContext'
import React, {useState} from 'react'
import { ResponseModal } from './ResponseModal'

type Props = {
    children: React.ReactNode
    popUpMessage?: PopUpMessage
    pushPopUpMessage: (msg: PopUpMessage) => void
    clearMessage: ()=>void
}

export const PopUpWrapper = ({children,pushPopUpMessage,popUpMessage,clearMessage}:Props) => {
  return (
    <PopUpContext.Provider value={{popUpMessage,pushPopUpMessage}}>
        <>
        {!!popUpMessage &&
            <ResponseModal
             close={clearMessage}
             text={popUpMessage.message}
             title={popUpMessage.title}
             type={popUpMessage.type}
            />
        }
        {children}
        </>
    </PopUpContext.Provider>
  )
}
