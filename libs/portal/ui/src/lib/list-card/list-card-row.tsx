import { ListItemProps } from '@chakra-ui/react'
import { Box, Flex, ListItem, Text } from '@redesignhealth/ui'

export interface ListCardRowProps extends ListItemProps {
  title?: string
  rightElement?: React.ReactNode
}

export const ListCardRow = ({
  children,
  title,
  rightElement,
  ...props
}: ListCardRowProps) => {
  const testId = title?.toLowerCase().replaceAll(' ', '-')
  return (
    <ListItem
      fontSize="md"
      display="flex"
      flexDir={['column', 'column', 'row']}
      px={6}
      py={4}
      _last={{ borderBottomRadius: '12px' }}
      data-testid={testId}
      {...props}
      gap={6}
      aria-labelledby={`${testId}-title`}
    >
      {title && (
        <Text
          id={`${testId}-title`}
          w={['full', '260px', '260px']}
          fontWeight="600"
          pb={[2, 0]}
        >
          {title}
        </Text>
      )}

      <Flex flex={1} whiteSpace="pre-wrap" justify="space-between">
        <Box>{children}</Box>
        {rightElement}
      </Flex>
    </ListItem>
  )
}
