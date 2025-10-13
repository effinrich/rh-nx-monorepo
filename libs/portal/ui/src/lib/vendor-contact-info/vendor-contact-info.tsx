import { MdFileCopy } from 'react-icons/md'
import { Flex, HStack, IconButton, Link, Text } from '@redesignhealth/ui'

export interface VendorContactInfoProps {
  name: string
  email: string
}

const VendorContactInfo = ({ name, email }: VendorContactInfoProps) => (
  <Flex direction="column">
    <Text>{name}</Text>
    <HStack spacing="2">
      <Link isExternal href={`mailto:${email}`}>
        <Text as="span">{email}</Text>
      </Link>
      <IconButton
        variant="link"
        color="primary.600"
        icon={<MdFileCopy />}
        aria-label="copy email"
        onClick={() => {
          navigator.clipboard.writeText(email)
        }}
      />
    </HStack>
  </Flex>
)

export default VendorContactInfo
