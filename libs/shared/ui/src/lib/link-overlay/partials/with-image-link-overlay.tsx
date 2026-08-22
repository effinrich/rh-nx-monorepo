import { Box } from '../../box/box'
import { Heading } from '../../heading/heading'
import { Text } from '../../text/text'

import { LinkBox, LinkOverlay } from '../link-overlay'

export function WithImageLinkOverlay() {
  return (
    <LinkBox
      as="article"
      maxW="sm"
      p="5"
      borderWidth="1px"
      rounded="md"
      _hover={{ shadow: 'md' }}
    >
      <Box mb="3">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop"
          alt="Product"
          style={{ borderRadius: '0.375rem' }}
        />
      </Box>
      <Heading size="md" my="2">
        <LinkOverlay href="#">Living Room Collection</LinkOverlay>
      </Heading>
      <Text mb="3">Explore our newest furniture designs for modern homes.</Text>
      <Text fontSize="sm" color="gray.500">
        Published: March 15, 2024
      </Text>
    </LinkBox>
  )
}
