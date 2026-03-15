import { useNavigate } from 'react-router-dom'
import {
  useGetCeoById,
  useGetUserInfo,
  useOptOutCeo
} from '@redesignhealth/portal/data-assets'
import {
  Button,
  CardRoot,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Text
} from '@redesignhealth/ui'

interface OptOutConfirmationProps {
  handleCancel(): void
}
const OptOutConfirmation = ({ handleCancel }: OptOutConfirmationProps) => {
  const { data: user } = useGetUserInfo()
  const { data: ceo } = useGetCeoById(user?.ceoInfo.id)
  const { mutateAsync: optOutCeo, isPending: optOutCeoIsSaving } =
    useOptOutCeo()
  const navigate = useNavigate()

  const handleContinue = async () => {
    if (ceo) {
      await optOutCeo({
        id: ceo.id,
        ceo
      })
    }
    navigate('/ceo-directory')
  }

  return (
    <CardRoot variant="outline">
      <CardHeader>
        <Text>
          You can always opt back in should you change your mind later.
        </Text>
      </CardHeader>
      <Divider />
      <CardBody>
        <CardRoot variant="outline">
          <CardBody>
            <Text fontSize="md" as="b">
              Most CEOs opt in to get the most benefit out of the community
            </Text>
            <Text>
              You will always have access to the directory even if you have not
              opted-in, but key details will be restricted from you. By
              opting-in you get to be a part of the discussions and connections
              found in the CEO community.
            </Text>
          </CardBody>
        </CardRoot>
      </CardBody>
      <Divider />
      {ceo && (
        <CardFooter display="flex" justify="flex-end" gap={3}>
          <Button variant="outline" onClick={handleCancel}>
            I want to opt-In
          </Button>
          <Button
            variant="solid" colorPalette="primary"
            onClick={handleContinue}
            loading={optOutCeoIsSaving}
          >
            Continue to directory
          </Button>
        </CardFooter>
      )}
    </CardRoot>
  )
}

export default OptOutConfirmation
