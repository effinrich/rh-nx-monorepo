import { Box, BoxProps } from '@redesignhealth/ui'

export interface PageProps extends BoxProps {
  children: React.ReactNode
}
const Page = ({ children, ...boxProps }: PageProps) => (
  <Box py={8} px={[4, 8]} as="main" {...boxProps} position="relative">
    {children}
  </Box>
)

export default Page
