import { Box, Button, Text } from '../../../index'

import { Heading } from '../heading'

export function CompositionHeading() {
  return (
    <Box maxW="32rem">
      <Heading mb={4}>Modern online and offline payments for Africa</Heading>
      <Text fontSize="xl">
        Paystack helps businesses in Africa get paid by anyone, anywhere in the
        world
      </Text>
      <Button size="lg" colorPalette="primary" mt="24px">
        Create a free account
      </Button>
    </Box>
  )
}
