import { ReactNode } from 'react'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button
} from '@redesignhealth/ui'

export interface InfoAlertProps {
  children: ReactNode
  title: string
  onClick?: VoidFunction
}

export const InfoAlert = ({ onClick, title, children }: InfoAlertProps) => {
  return (
    <Alert status="info" mb="24px" bg="gray.200" rounded="lg">
      <Box>
        <AlertTitle fontWeight={700} fontSize="18px" lineHeight="28px">
          {title}
        </AlertTitle>
        <AlertDescription
          fontWeight={400}
          fontSize="16px"
          lineHeight="24px"
          display="inline-block"
          mt="16px"
        >
          {children}
        </AlertDescription>
        <Button onClick={onClick} colorScheme="primary" mt="16px">
          Got it
        </Button>
      </Box>
    </Alert>
  )
}

export default InfoAlert
