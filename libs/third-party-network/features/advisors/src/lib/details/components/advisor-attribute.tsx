import { ReactNode } from 'react'
import { Flex, ListItem, Text } from '@redesignhealth/ui'

interface AdvisorAttributeProps {
  attribute: string
  children?: ReactNode
}

export const AdvisorAttribute = ({
  attribute,
  children
}: AdvisorAttributeProps) => {
  return (
    <Flex as={ListItem} flexDir="column" gap="4px">
      <Text
        as="span"
        fontSize="md"
        color="gray.600"
        lineHeight="none"
        fontWeight="semibold"
      >
        {attribute}
      </Text>
      <Text
        as="span"
        fontSize="md"
        lineHeight="7"
        fontWeight="normal"
        letterSpacing="tight"
        color="gray.900"
      >
        {children}
      </Text>
    </Flex>
  )
}
