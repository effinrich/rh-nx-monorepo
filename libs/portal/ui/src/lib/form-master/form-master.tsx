import {
  Box,
  Button,
  CardRoot,
  CardBody,
  CardFooter,
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
    <CardRoot variant={"unstyled" as any}>
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
          {/* @ts-expect-error Chakra v3 CardFooter children typing */}
          <CardFooter gap={3} justify="end" my={4}>
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
