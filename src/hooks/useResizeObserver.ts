import _ from 'lodash'
import { useEffect, useRef } from 'react'

type Options = {
  wait?: number
}

const DEFAULT_THROTTLE = 10

export function useResizeObserver<HTMLRef extends Element>(ref: React.RefObject<HTMLRef>, callback: () => void, options?: Options) {
  // will not react to change in callback func
  const throttledCallback = useRef(_.throttle(callback, options?.wait || DEFAULT_THROTTLE))
  useEffect(() => {
    const element = ref.current
    const resizeObserver = new ResizeObserver(() => throttledCallback.current())

    if (element) {
      resizeObserver.observe(element)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [])
}
