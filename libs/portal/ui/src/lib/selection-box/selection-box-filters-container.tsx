import { ReactNode } from 'react'
import { Flex, FlexProps, Text } from '@redesignhealth/ui'

interface SelectionBoxFiltersContainerProps extends FlexProps {
  clearButton?: ReactNode
}

export const SelectionBoxFiltersContainer = ({
  children,
  clearButton,
  ...props
}: SelectionBoxFiltersContainerProps) => {
  return (
    <Flex
      {...props}
      flexDirection={['column', 'column', 'column', 'row']}
      align={['normal', 'normal', 'normal', 'center']}
      mt="16px"
    >
      <Text
        w={['full', 'full', 'full', '10%']}
        fontSize="md"
        lineHeight={6}
        color="gray.500"
        fontWeight="medium"
        pb={[2, 2, 2, 0]}
      >
        Filter by
      </Text>
      <Flex
        w={['full', 'full', 'full', '90%']}
        flexDirection={['column', 'column', 'column', 'column']}
        pb={[4, 4, 4, 0]}
      >
        {children}
      </Flex>
      {clearButton}
    </Flex>
  )
}
