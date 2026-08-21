import { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  Box,
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRoot,
  Flex,
  Spacer,
  Text,
  Tooltip
} from '@redesignhealth/ui'

interface FormFieldProps {
  name: string
  label: string
  helper?: string
  children: ReactNode
  disabledHelpText?: string
  testid?: string
  optional?: boolean
}

export const FormFieldMaster = ({
  children,
  name,
  helper,
  label,
  testid,
  disabledHelpText,
  optional = false
}: FormFieldProps) => {
  const { formState } = useFormContext()
  const errorMessage = formState.errors[name]?.message as string | undefined
  const isInvalid = Boolean(errorMessage)

  return (
    <Tooltip
      label={disabledHelpText}
      placement="top-start"
      disabled={!disabledHelpText}
    >
      <FieldRoot data-testid={testid} invalid={isInvalid}>
        <Flex direction={['column', 'column', 'row']}>
          <Box w={['100%', '100%', '25%']} mr={4}>
            {/* @ts-expect-error Chakra v3 children typing */}
            <FieldLabel color="gray.800">
              {optional ? (
                label
              ) : (
                <Text
                  as="span"
                  css={{
                    '&::after': {
                      content: '" *"',
                      color: '#fd3131',
                      whiteSpace: 'nowrap'
                    }
                  }}
                >
                  {label}
                </Text>
              )}
            </FieldLabel>
          </Box>

          <Spacer />
          <Box w={['100%', '100%', '75%']}>
            {children}
            {isInvalid ? (
              // @ts-expect-error Chakra v3 children typing
              <FieldErrorText>{errorMessage}</FieldErrorText>
            ) : (
              // @ts-expect-error Chakra v3 children typing
              <FieldHelperText>{helper}</FieldHelperText>
            )}
          </Box>
        </Flex>
      </FieldRoot>
    </Tooltip>
  )
}

export default FormFieldMaster
