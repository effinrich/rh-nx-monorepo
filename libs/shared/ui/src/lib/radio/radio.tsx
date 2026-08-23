import { forwardRef } from 'react'
import { RadioGroup as ChakraRadioGroup } from '@chakra-ui/react'

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
      <ChakraRadioGroup.ItemIndicator />
      {children && (
        <ChakraRadioGroup.ItemText>{children}</ChakraRadioGroup.ItemText>
      )}
    </ChakraRadioGroup.Item>
  )
})

export type { RadioGroupItemProps,RadioGroupRootProps } from '@chakra-ui/react'
export {
  RadioGroupItem,
  RadioGroupItemControl,
  RadioGroupItemHiddenInput,
  RadioGroupRoot,
  useRadioGroup
} from '@chakra-ui/react'
