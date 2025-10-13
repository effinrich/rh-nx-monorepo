import { MdStore } from 'react-icons/md'
import { Link } from 'react-router-dom'
import {
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  Icon,
  Text,
  VStack
} from '@redesignhealth/ui'

interface NoSearchTermsProps {
  children?: React.ReactNode
}

export const NoSearchTerms = ({ children }: NoSearchTermsProps) => {
  return (
    <Flex direction="row" alignItems="center" justifyContent="center" h="50vh">
      <VStack w="lg" spacing={4}>
        <Circle
          bg="primary.200"
          borderColor="primary.100"
          borderWidth="8px"
          borderStyle="solid"
          p={2}
        >
          <Icon as={MdStore} color="black" boxSize={6} />
        </Circle>
        <Box textAlign="center">
          <Heading size="xs" as="h3" fontWeight={700} color="gray.900" pb={2}>
            Tell us about your vendor experiences
          </Heading>
          <Text fontSize="md" color="gray.500" lineHeight={6} pb={2}>
            Once you've engaged a vendor, even if it's just early conversations,
            please tell us a little about them by adding them to your
            My&nbsp;Vendors list.
          </Text>
        </Box>
        <Button as={Link} colorScheme="primary" variant="solid" to="add">
          Tell us about a vendor
        </Button>
      </VStack>
    </Flex>
  )
}

export default NoSearchTerms
