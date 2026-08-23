import {
  Box,
  Button,
  CardBody,
  CardFooter,
  CardRoot,
  Separator,
  Stack,
  StackSeparator
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
    <CardRoot bg="transparent" boxShadow="none">
      <form onSubmit={onSubmit} name={submitText}>
        <Stack separator={<StackSeparator />} gap={5}>
          <CardBody>{children}</CardBody>
        </Stack>

        <Box
          position={isSticky ? 'sticky' : 'relative'}
          bottom={isSticky ? 0 : 'auto'}
          w={isSticky ? 'full' : 'auto'}
          pb={isSticky ? 2 : 'auto'}
          bgColor="white"
        >
          <Separator mt={8} />
          <CardFooter gap={3} justifyContent="end" my={4}>
            <Button onClick={onCancel} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={isPending || !isValid}
              loading={isPending}
              colorPalette="primary"
              type="submit"
            >
              {submitText}
            </Button>
          </CardFooter>
        </Box>
      </form>
    </CardRoot>
  )
}

export default FormMaster
