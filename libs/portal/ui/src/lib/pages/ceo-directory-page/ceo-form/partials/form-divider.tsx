import { type BoxProps, AbsoluteCenter, Box, Separator } from '@redesignhealth/ui'

interface FormDividerProps extends BoxProps {
  title: string
}

const FormDivider = ({ title, ...rest }: FormDividerProps) => (
  <Box position="relative" {...rest}>
    <Separator />
    <AbsoluteCenter bg="white" px="4" color="gray.600">
      {title}
    </AbsoluteCenter>
  </Box>
)

export default FormDivider
