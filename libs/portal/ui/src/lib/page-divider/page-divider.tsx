import { AbsoluteCenter, Box, Divider } from '@redesignhealth/ui'

interface PageDividerProps {
  content: string
}

export const PageDivider = ({ content }: PageDividerProps) => {
  return (
    <Box position="relative" py={2}>
      <Divider />
      <AbsoluteCenter px={[2, 4]} bg="white">
        {content}
      </AbsoluteCenter>
    </Box>
  )
}

export default PageDivider
