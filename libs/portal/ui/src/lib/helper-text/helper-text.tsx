import { ReactNode } from 'react'
import { type TextProps, Text } from '@redesignhealth/ui'

interface HelperTextProps extends TextProps {
  helpText: ReactNode
  link?: ReactNode
}

export const HelperText = ({
  helpText,
  link,
  lineHeight = '24px',
  fontSize = '16px',
  fontWeight = 'normal',
  color = 'gray.500',
  mt = '4px',
  ...props
}: HelperTextProps) => (
  <Text as="span" {...props}>
    {helpText}
    {link && <> {link}</>}
  </Text>
)
