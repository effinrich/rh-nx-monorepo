import { type DividerProps, Divider as ChakraDivider } from '@chakra-ui/react'

export const Divider = (props: DividerProps) => {
  return (
    <div>
      <ChakraDivider {...props} />
    </div>
  )
}
