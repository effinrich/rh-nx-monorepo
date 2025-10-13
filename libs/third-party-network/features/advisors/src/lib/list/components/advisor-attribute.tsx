import { ReactNode } from 'react'
import { Flex, ListItem, Text } from '@redesignhealth/ui'

interface AdvisorAttributeProps {
  attribute: string
  children: ReactNode
}

export const AdvisorAttribute = ({
  attribute,
  children
}: AdvisorAttributeProps) => {
  return (
    <Flex as={ListItem} flexDir="column" gap="8px">
      <Text
        as="span"
        fontSize="14px"
        fontWeight="medium"
        color="gray.600"
        letterSpacing="tight"
        lineHeight="none"
      >
        {attribute}
      </Text>
      <Text as="span" fontSize="14px" fontWeight="semibold" lineHeight="none">
        {children}
      </Text>
    </Flex>
  )
}
