import { SCROLL_CONTAINER_ID, scrollToTop } from '@redesignhealth/portal/utils'
import { Button, Flex, Text } from '@redesignhealth/ui'

export interface PaginationProps {
  handlePageChange(newPage: number): void
  totalPages: number
  currentPage?: number
  scrollContainerId?: string
}

const Pagination = ({
  totalPages,
  handlePageChange,
  scrollContainerId = SCROLL_CONTAINER_ID,
  currentPage = 0
}: PaginationProps) => {
  if (totalPages < 2) {
    return null
  }

  return (
    <Flex justify="space-between">
      <Text>
        Page {currentPage + 1} of {totalPages}
      </Text>
      <Flex gap="2">
        <Button
          isDisabled={currentPage === 0}
          onClick={() => {
            handlePageChange(currentPage - 1)
            scrollToTop(scrollContainerId)
          }}
          variant="outline"
        >
          Previous
        </Button>
        <Button
          isDisabled={currentPage + 1 >= totalPages}
          onClick={() => {
            handlePageChange(currentPage + 1)
            scrollToTop(scrollContainerId)
          }}
          variant="outline"
        >
          Next
        </Button>
      </Flex>
    </Flex>
  )
}

export default Pagination
