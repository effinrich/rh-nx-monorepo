import { useTitle } from 'react-use'
import { AdvisorList } from '@redesignhealth/third-party-network/features/advisors'
import { Box, Button, Flex, Text } from '@redesignhealth/ui'

export const Home = () => {
  useTitle('RH Advise | Home')

  return (
    <Box>
      <Flex as="header" align="flex-start" justify="space-between">
        <Box>
          <Text as="h1" fontSize="4xl" fontWeight="500">
            RH Advise
          </Text>
          <Text as="p" fontSize="md" color="gray.600" lineHeight="none" mt="2">
            Search Redesign Health’s advisor database to find experts to consult
            on concept development
          </Text>
        </Box>
        <Button
          as="a"
          href="https://5inxi4pt259.typeform.com/to/SVq9ZUao"
          target="_blank"
          variant="solid"
          colorScheme="blue"
          flexShrink="0"
        >
          Refer Advisor
        </Button>
      </Flex>

      <Box mt="56px">
        <AdvisorList />
      </Box>
    </Box>
  )
}
