import { ReactNode } from 'react'
import { Box } from '@redesignhealth/ui'

import { InfoAlert } from '../info-alert/info-alert'

export interface DisclaimerBoxProps {
  children: ReactNode
  isFirstVisit: boolean | undefined
  onClickAlert: () => void
  title: string
}

export const DisclaimerBox = ({
  children,
  isFirstVisit,
  onClickAlert,
  title
}: DisclaimerBoxProps) => (
  <Box w="full">
    {isFirstVisit && (
      <InfoAlert title={title} onClick={onClickAlert}>
        {children}
      </InfoAlert>
    )}
  </Box>
)
