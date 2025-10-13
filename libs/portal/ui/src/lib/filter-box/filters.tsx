import { type BoxProps, Button, Flex, Text } from '@redesignhealth/ui'

interface FiltersProps extends BoxProps {
  children: React.ReactNode
  handleClear?(): void
}

export const Filters = ({ children, handleClear, ...props }: FiltersProps) => {
  return (
    <Flex
      flexDirection={['column', 'column', 'row']}
      {...props}
      alignItems="baseline"
      gap="16px"
    >
      <Text fontSize="sm" color="gray.500" fontWeight="medium" flexShrink="0">
        Filter by
      </Text>
      <Flex
        width={['100%', '100%', 'initial']}
        flexDirection={['column', 'column', 'row']}
        gap="12px"
        wrap="wrap"
      >
        {children}
      </Flex>
      {handleClear && (
        <Button
          width={['100%', '100%', 'initial']}
          type="reset"
          onClick={handleClear}
          variant="link"
          size="sm"
          colorScheme="primary"
        >
          Clear filters
        </Button>
      )}
    </Flex>
  )
}

export default Filters
