import {
  Button,
  CardBody,
  CardFooter,
  CardRoot,
  Separator,
  Stack
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
    <CardRoot bg="transparent" boxShadow="none" maxWidth="6xl">
      <form onSubmit={onSubmit} name={submitText}>
        <Stack separator={<Separator />} gap={5}>
          <CardBody>{children}</CardBody>
        </Stack>
        <CardFooter gap={3} justifyContent="end" mt={4}>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={disabled} colorPalette="primary" type="submit">
            {submitText}
          </Button>
        </CardFooter>
      </form>
    </CardRoot>
  )
}

export default Form
