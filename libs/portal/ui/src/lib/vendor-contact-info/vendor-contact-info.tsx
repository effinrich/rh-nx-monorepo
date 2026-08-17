import { MdFileCopy } from 'react-icons/md'
import { Flex, HStack, IconButton, Link, Text } from '@redesignhealth/ui'

export interface VendorContactInfoProps {
  name: string
  email: string
}

const VendorContactInfo = ({ name, email }: VendorContactInfoProps) => (
  <Flex direction="column">
    <Text>{name}</Text>
    <HStack gap="2">
      <Link href={`mailto:${email}`} target="_blank" rel="noopener noreferrer">
        <Text as="span">{email}</Text>
      </Link>
      <IconButton
        variant="plain"
        color="primary.600"
        aria-label="copy email"
        onClick={() => {
          navigator.clipboard.writeText(email)
        }}
      >
        <MdFileCopy />
      </IconButton>
    </HStack>
  </Flex>
)

export default VendorContactInfo
