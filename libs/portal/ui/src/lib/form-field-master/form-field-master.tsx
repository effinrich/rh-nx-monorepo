import { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import styled from '@emotion/styled'
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Spacer,
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

const StyledReqInput = styled.span`
  ::after {
    content: ' *';
    color: #fd3131; // this needs to a theme prop
    white-space: nowrap;
  }
`

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
      isDisabled={!disabledHelpText}
    >
      <FormControl data-testid={testid} isInvalid={isInvalid}>
        <Flex direction={['column', 'column', 'row']}>
          <Box w={['100%', '100%', '25%']} mr={4}>
            <FormLabel color="gray.800">
              {optional ? label : <StyledReqInput>{label}</StyledReqInput>}
            </FormLabel>
          </Box>

          <Spacer />
          <Box w={['100%', '100%', '75%']}>
            {children}
            {isInvalid ? (
              <FormErrorMessage>{errorMessage}</FormErrorMessage>
            ) : (
              <FormHelperText>{helper}</FormHelperText>
            )}
          </Box>
        </Flex>
      </FormControl>
    </Tooltip>
  )
}

export default FormFieldMaster
