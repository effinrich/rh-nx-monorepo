import { Switch as ChakraSwitch } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface SwitchProps extends ChakraSwitch.RootProps {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  rootRef?: React.Ref<HTMLLabelElement>
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { children, inputProps, rootRef, ...props },
  ref
) {
  return (
    <ChakraSwitch.Root ref={rootRef} {...props}>
      <ChakraSwitch.HiddenInput ref={ref} {...inputProps} />
      <ChakraSwitch.Control>
        <ChakraSwitch.Thumb />
      </ChakraSwitch.Control>
      {children && <ChakraSwitch.Label>{children}</ChakraSwitch.Label>}
    </ChakraSwitch.Root>
  )
})

export {
  SwitchRoot,
  SwitchControl,
  SwitchThumb,
  SwitchLabel,
  SwitchHiddenInput,
  SwitchIndicator // Note: SwitchIndicator might not exist in all v3 versions, check if needed
} from '@chakra-ui/react'

export type { SwitchRootProps } from '@chakra-ui/react'
