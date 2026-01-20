import { RadioGroup as ChakraRadioGroup } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const RadioGroup = ChakraRadioGroup

export interface RadioProps extends ChakraRadioGroup.ItemProps {
  children?: React.ReactNode
}

export const Radio = forwardRef<HTMLDivElement, RadioProps>(function Radio(
  { children, ...props },
  ref
) {
  return (
    <ChakraRadioGroup.Item ref={ref} {...props}>
      <ChakraRadioGroup.ItemHiddenInput />
      <ChakraRadioGroup.ItemControl>
        <ChakraRadioGroup.ItemIndicator />
      </ChakraRadioGroup.ItemControl>
      {children && (
        <ChakraRadioGroup.ItemText>{children}</ChakraRadioGroup.ItemText>
      )}
    </ChakraRadioGroup.Item>
  )
})

export { useRadioGroup } from '@chakra-ui/react'
export type { RadioGroupRootProps, RadioGroupItemProps } from '@chakra-ui/react'
