import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Divider
} from '@redesignhealth/ui'

import OptInForm from './partials/opt-in-form'

interface OptInQuestionProps {
  setIsOptIn(newValue: string): void
  isOptIn?: string
  handleConfirm(): void
}

const OptInQuestion = ({
  handleConfirm,
  isOptIn,
  setIsOptIn
}: OptInQuestionProps) => {
  return (
    <Card variant="outline">
      <CardHeader>
        Do you wish to opt in to sharing your information with other founders?
        You can always change this later in your CEO profile.
      </CardHeader>
      <Divider />
      <OptInForm isOptIn={isOptIn} setIsOptIn={setIsOptIn} />
      <Divider />
      <CardFooter justify="flex-end" gap={3}>
        <Button variant="ghost" isDisabled>
          Back
        </Button>
        <Button variant="primary" isDisabled={!isOptIn} onClick={handleConfirm}>
          Continue
        </Button>
      </CardFooter>
    </Card>
  )
}

export default OptInQuestion
