import { useMediaQuery } from '@mui/material'
import { DesktopResultsView } from './DesktopResultsView'
import { MobileResultsView } from './MobileResultsView'
import { ResultsViewProps } from './types'

export const ResultsView = (props: ResultsViewProps) => {
  const isDesktop = useMediaQuery('@media (min-width: 1308px)')
  return isDesktop ? <DesktopResultsView {...props} /> : <MobileResultsView {...props} />
}
