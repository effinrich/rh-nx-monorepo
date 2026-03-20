import { RadioGroup as ChakraRadioGroup } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const RadioGroup = ChakraRadioGroup
export const RadioGroupRoot = ChakraRadioGroup.Root
/* eslint-disable @typescript-eslint/no-explicit-any */
export const RadioGroupItem = ChakraRadioGroup.Item as any
export const RadioGroupItemControl = ChakraRadioGroup.ItemControl as any
export const RadioGroupItemHiddenInput = ChakraRadioGroup.ItemHiddenInput as any
/* eslint-enable @typescript-eslint/no-explicit-any */

export interface RadioProps extends ChakraRadioGroup.ItemProps {
  children?: React.ReactNode
  value: string
  disabled?: boolean
}

export const Radio = forwardRef<HTMLDivElement, RadioProps>(function Radio(
  { children, ...props },
  ref
) {
  return (
    // @ts-expect-error Chakra v3 RadioGroup.Item children typing
    <ChakraRadioGroup.Item ref={ref} {...props}>
      <ChakraRadioGroup.ItemHiddenInput />
      {/* @ts-expect-error Chakra v3 RadioGroup.ItemControl children typing */}
      <ChakraRadioGroup.ItemControl>
        <ChakraRadioGroup.ItemIndicator />
      </ChakraRadioGroup.ItemControl>
      {children && (
        // @ts-expect-error Chakra v3 RadioGroup.ItemText children typing
        <ChakraRadioGroup.ItemText>{children}</ChakraRadioGroup.ItemText>
      )}
    </ChakraRadioGroup.Item>
  )
})

export { useRadioGroup } from '@chakra-ui/react'
export type { RadioGroupRootProps, RadioGroupItemProps } from '@chakra-ui/react'
