import { As } from '@chakra-ui/react'
import { Flex, Icon, Text } from '@redesignhealth/ui'

interface SecondaryTextProps {
  children: React.ReactNode
  icon: As
  testid?: string
}

const SecondaryText = ({ children, icon, testid }: SecondaryTextProps) => (
  <Flex gap={3}>
    <Icon boxSize={6} as={icon} color="gray.500" />
    <Text lineHeight={6} color="gray.600" data-testid={testid}>
      {children}
    </Text>
  </Flex>
)

export default SecondaryText
