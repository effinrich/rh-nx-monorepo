import { LinkBox, LinkOverlay } from '../../link-overlay/link-overlay'

export function WithLinkOverlayLink() {
  return (
    <LinkBox
      borderWidth="1px"
      bg="white"
      p="4"
      rounded="lg"
      as="article"
      _hover={{ shadow: 'lg' }}
    >
      <h2>
        <LinkOverlay href="google.com">Some blog post</LinkOverlay>
      </h2>
      <p>
        As a side note, using quotation marks around an attribute value is
        required only if this value is not a valid identifier.
      </p>
    </LinkBox>
  )
}
