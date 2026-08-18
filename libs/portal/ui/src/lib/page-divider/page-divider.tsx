import { AbsoluteCenter, Box, Separator } from '@redesignhealth/ui'

interface PageDividerProps {
  content: string
}

export const PageDivider = ({ content }: PageDividerProps) => {
  return (
    <Box position="relative" py={2}>
      <Separator />
      <AbsoluteCenter px={[2, 4]} bg="white">
        {content}
      </AbsoluteCenter>
    </Box>
  )
}

export default PageDivider
