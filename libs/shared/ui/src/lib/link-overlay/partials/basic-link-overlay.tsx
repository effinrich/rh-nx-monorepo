import { Heading } from '../../heading/heading'
import { Text } from '../../text/text'

import { LinkBox, LinkOverlay } from '../link-overlay'

export function BasicLinkOverlay() {
  return (
    <LinkBox as="article" maxW="sm" p="5" borderWidth="1px" rounded="md">
      <Heading size="md" my="2">
        <LinkOverlay href="#">New Product Launch</LinkOverlay>
      </Heading>
      <Text>
        Learn about our exciting new product features and improvements.
      </Text>
    </LinkBox>
  )
}
