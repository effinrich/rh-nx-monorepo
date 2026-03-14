import { ListRoot, Stack, StackSeparator, StackProps } from '@redesignhealth/ui'

interface DetailsCardBodyProps extends StackProps {
  children: React.ReactNode
}
const DetailsCardBody = ({ children, ...rest }: DetailsCardBodyProps) => (
  <Stack as={ListRoot} separator={<StackSeparator />} {...rest}>
    {children}
  </Stack>
)

export default DetailsCardBody
