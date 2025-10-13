import { MdCheck } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { Button, Center, Icon, Stack, Text } from '@redesignhealth/ui'

export const CeoOnboardingSuccess = () => {
  const navigate = useNavigate()
  return (
    <Center h="100vh">
      <Stack align="center">
        <Icon as={MdCheck} boxSize={20} color="primary.600" mb={4} />
        <Text mb={8} as="b" fontSize="lg">
          Thanks for completing the onboarding
        </Text>
        <Stack>
          <Button
            colorScheme="primary"
            onClick={() => navigate('/ceo-directory')}
          >
            Take me to the directory
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/ceo-directory/onboarding')}
          >
            Previous
          </Button>
        </Stack>
      </Stack>
    </Center>
  )
}

export default CeoOnboardingSuccess
