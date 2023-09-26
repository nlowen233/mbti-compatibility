import { Head } from '@/components/Head'
import { MainWrapper } from '@/components/MainWrapper'
import { PopUpContext } from '@/contexts/PopUpContext'
import { useResizeObserver } from '@/hooks/useResizeObserver'
import { Paths } from '@/misc/Paths'
import { Utils } from '@/misc/Utils'
import { TestAndNickname } from '@/types/SQLTypes'
import { UserContext } from '@auth0/nextjs-auth0/client'
import { useMediaQuery } from '@mui/material'
import { useRouter } from 'next/router'
import { useContext, useRef, useState } from 'react'

const DEFAULT_RESULT_CONTAINER_HEIGHT = 400

export default function Results() {
  const router = useRouter()
  const [resultContainerHeight, setResultContainerHeight] = useState(DEFAULT_RESULT_CONTAINER_HEIGHT)
  const { push, isFallback } = useRouter()
  const { user } = useContext(UserContext)
  const { pushPopUpMessage } = useContext(PopUpContext)
  const resultContainerRef = useRef<HTMLDivElement>(null)
  const hideStickyButtonShowStatic = useMediaQuery('@media (min-width: 620px)')
  const test = {} as TestAndNickname
  const answers = []
  const getHeader = () => {
    if (isFallback) {
      return `Hang on while we get your results ready...`
    }
    if (!answers.length) {
      return ``
    }
    return !!test?.nickName ? `${test.nickName}'s Results` : `Your Results`
  }

  const onButtonClick = async () => {
    if (test?.userId !== user?.sub) {
      return router.push(Paths.home)
    }
    if (!test?.id) {
      return pushPopUpMessage({ title: 'Could not find your test ID', message: 'Share failed', type: 'error' })
    }
    Utils.shareResults(test.id)
  }

  const buttonText = test?.userId === user?.sub ? 'Share your results' : 'Take the test!'

  useResizeObserver(resultContainerRef, () => {
    setResultContainerHeight(resultContainerRef.current?.clientHeight || DEFAULT_RESULT_CONTAINER_HEIGHT)
  })
  return (
    <>
      <Head />
      <MainWrapper></MainWrapper>
    </>
  )
}
