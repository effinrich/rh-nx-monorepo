import { MdCheck } from 'react-icons/md'
import { Button, HStack, Icon, Text } from '@redesignhealth/ui'

interface BuyerRequestButtonProps {
  onClick(): void
  hasRequestedInfo: boolean
}
const BuyerRequestButton = ({
  hasRequestedInfo,
  onClick
}: BuyerRequestButtonProps) => {
  if (hasRequestedInfo) {
    return (
      <HStack>
        <Icon as={MdCheck} />
        <Text color="gray.600" fontWeight="semibold">
          Contact info requested
        </Text>
      </HStack>
    )
  }
  return (
    <Button onClick={onClick} colorScheme="primary">
      Request contact info
    </Button>
  )
}

export default BuyerRequestButton
