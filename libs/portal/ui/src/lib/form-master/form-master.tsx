import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Stack,
  StackDivider
} from '@redesignhealth/ui'

interface FormProps {
  children: React.ReactNode
  disabled?: boolean
  onSubmit(): void
  onCancel?(): void
  submitText?: string
  isPending: boolean
  isValid: boolean
  isSticky?: boolean
}

const FormMaster = ({
  onSubmit,
  onCancel,
  disabled,
  isPending,
  isValid,
  children,
  isSticky = false,
  submitText = 'Save changes'
}: FormProps) => {
  return (
    <Card variant="unstyled">
      <form onSubmit={onSubmit} name={submitText}>
        <Stack divider={<StackDivider />} spacing={5}>
          <CardBody>{children}</CardBody>
        </Stack>

        <Box
          position={isSticky ? 'sticky' : 'relative'}
          bottom={isSticky ? 0 : 'auto'}
          w={isSticky ? 'full' : 'auto'}
          pb={isSticky ? 2 : 'auto'}
          bgColor="white"
        >
          <Divider mt={8} />
          <CardFooter gap={3} justify="end" my={4}>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button
              isDisabled={isPending || !isValid}
              isLoading={isPending}
              colorScheme="primary"
              type="submit"
            >
              {submitText}
            </Button>
          </CardFooter>
        </Box>
      </form>
    </Card>
  )
}

export default FormMaster
