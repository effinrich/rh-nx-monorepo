import { Button, Flex, Text } from '@redesignhealth/ui'

interface FiltersProps {
  children: React.ReactNode
  handleClear?(): void
}

export const Filters = ({ children, handleClear }: FiltersProps) => {
  return (
    <Flex
      flexDirection={['column', 'column', 'row']}
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
          variant="plain"
          size="sm"
          colorPalette="primary"
        >
          Clear filters
        </Button>
      )}
    </Flex>
  )
}

export default Filters
