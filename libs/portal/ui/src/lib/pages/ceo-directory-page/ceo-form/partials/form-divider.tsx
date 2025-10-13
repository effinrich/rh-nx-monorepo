import { type BoxProps, AbsoluteCenter, Box, Divider } from '@redesignhealth/ui'

interface FormDividerProps extends BoxProps {
  title: string
}

const FormDivider = ({ title, ...rest }: FormDividerProps) => (
  <Box position="relative" {...rest}>
    <Divider />
    <AbsoluteCenter bg="white" px="4" color="gray.600">
      {title}
    </AbsoluteCenter>
  </Box>
)

export default FormDivider
