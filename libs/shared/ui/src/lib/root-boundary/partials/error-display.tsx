import { Button } from '../button/button'
import { Flex } from '../flex/flex'
import { Heading } from '../heading/heading'
import { Text } from '../text/text'

interface ErrorDisplayProps {
  statusCode: number | string
  statusText: string
  message: string
}

export function ErrorDisplay({
  statusCode,
  statusText,
  message
}: ErrorDisplayProps) {
  return (
    <Flex
      flexDir="column"
      justify="center"
      p={{ base: '32px', xl: '112px' }}
      h="100%"
    >
      <Heading
        as="h1"
        fontSize="16px"
        lineHeight="24px"
        fontWeight="semibold"
        color="primary.700"
      >
        {statusCode} error
      </Heading>
      <Text
        mt="12px"
        fontSize="60px"
        lineHeight="72px"
        letterSpacing="-0.02em"
        fontWeight="semibold"
        color="gray.900"
      >
        {statusText}
      </Text>
      <Text
        mt="24px"
        fontSize="20px"
        lineHeight="30px"
        fontWeight="normal"
        color="gray.500"
      >
        {message}
      </Text>
      <Flex gap="12px" mt="48px">
        <Button variant="outline" size={{ base: 'md', md: 'lg' }}>
          Go Back
        </Button>
        <Button colorPalette="primary" size={{ base: 'md', md: 'lg' }}>
          Take me home
        </Button>
      </Flex>
    </Flex>
  )
}
