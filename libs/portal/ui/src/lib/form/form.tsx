import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Stack,
  StackDivider
} from '@redesignhealth/ui'

interface FormProps {
  children: React.ReactNode
  disabled: boolean
  onSubmit(): void
  onCancel?(): void
  submitText?: string
}

const Form = ({
  onSubmit,
  onCancel,
  disabled,
  children,
  submitText = 'Save changes'
}: FormProps) => {
  return (
    <Card variant="unstyled" maxWidth="6xl">
      <form onSubmit={onSubmit} name={submitText}>
        <Stack divider={<StackDivider />} spacing={5}>
          <CardBody>{children}</CardBody>
        </Stack>
        <CardFooter gap={3} justify="end" mt={4}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button isDisabled={disabled} colorScheme="primary" type="submit">
            {submitText}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default Form
