import { Desktop } from './TestNode/Desktop'
import { Mobile } from './TestNode/Mobile'
import { TestNodeProps } from './types'

export const TestNode = (props: TestNodeProps) => {
  return props.isMobile ? <Mobile {...props} /> : <Desktop {...props} />
}
