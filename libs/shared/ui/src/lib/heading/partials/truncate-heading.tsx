import { Box } from '../../../index'

import { Heading } from '../heading'

export function TruncateHeadingExample() {
  return (
    <Box maxW={500}>
      No Truncation
      <Heading>
        Basic text writing, including headings, body text, lists, and more.
      </Heading>
      <br />
      With Truncation
      <Heading lineClamp={1}>
        Basic text writing, including headings, body text, lists, and more.
      </Heading>
    </Box>
  )
}
