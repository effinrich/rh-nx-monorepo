import { MdSearch } from 'react-icons/md'
import {
  Box,
  Circle,
  Flex,
  Heading,
  Icon,
  Text,
  VStack
} from '@redesignhealth/ui'

interface NoSearchResultsProps {
  /**
   * searchName: Refers to the thing being searched, which would be relative to
   * the page/view where the search is being used.
   * Example 1: If on the Library page `searchName` would be "documents" or similar.
   * Example 2: If on the Vendors page `searchName` would be "vendors".
   */
  searchName: string | undefined
  children?: React.ReactNode
}

export const NoSearchResults = ({
  searchName,
  children
}: NoSearchResultsProps) => {
  return (
    <Flex direction="row" alignItems="center" justifyContent="center" h="50vh">
      <VStack w="sm" spacing={4}>
        <Circle
          bg="primary.200"
          borderColor="primary.100"
          borderWidth="8px"
          borderStyle="solid"
          p={2}
        >
          <Icon as={MdSearch} color="galaxy.500" boxSize={6} />
        </Circle>
        <Box textAlign="center">
          <Heading size="xs" as="h3" fontWeight={700} color="gray.900" pb={2}>
            No {searchName} found
          </Heading>
          <Text fontSize="md" color="gray.500" lineHeight={6}>
            Try adjusting your search or filters to find the {searchName} you're
            looking for.
          </Text>
        </Box>
        {children}
      </VStack>
    </Flex>
  )
}

export default NoSearchResults
