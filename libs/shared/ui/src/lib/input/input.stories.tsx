/* eslint-disable react/no-children-prop */
import * as React from 'react'
import { LuCheck, LuPhone } from 'react-icons/lu'
import { useDisclosure } from '@chakra-ui/react'
import {
  Box,
  Button,
  Container,
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRoot,
  InputProps,
  Stack,
  Text
} from '@chakra-ui/react'

import { Meta } from '@storybook/react-vite'

import { Input, InputGroup } from './input'

export default {
  title: 'Components / Forms / Input',
  component: Input,
  decorators: [
    Story => (
      <Container>
        <Story />
      </Container>
    )
  ]
} as Meta

export const Basic = () => <Input placeholder="Basic input" />

export const Controlled = () => {
  const [value, setValue] = React.useState('Starting...')
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setValue(event.target.value)

  return (
    <>
      <Input
        value={value}
        onChange={handleChange}
        placeholder="Controlled input"
      />
      <Text fontSize="13px" pl={4} pt={2}>
        {value}
      </Text>
    </>
  )
}

export const WithSizes = () => (
  <Stack align="start">
    {['xs', 'sm', 'md', 'lg'].map(size => (
      <Input key={size} size={size} placeholder="This is an input component" />
    ))}
  </Stack>
)

export const WithStates = () => (
  <Stack align="start">
    <Input placeholder="Idle" />
    <Input invalid placeholder="isInvalid" />
    <Input disabled placeholder="isDisabled" />
    <Input readOnly placeholder="isReadonly" />
  </Stack>
)

export const WithVariants = () => (
  <Stack align="start">
    <Input variant="outline" placeholder="Outline" />
    <Input variant="filled" placeholder="Filled" />
    <Input variant="flushed" placeholder="Flushed" />
    <Input variant="unstyled" placeholder="Unstyled" />
  </Stack>
)

export const WithInputAddon = () => (
  <Stack align="start">
    <InputGroup startAddon="+234">
      <Input placeholder="Phone number..." />
    </InputGroup>

    <InputGroup size="sm" startAddon="https://" endAddon=".com">
      <Input placeholder="website.com" />
    </InputGroup>
  </Stack>
)

export const WithInputElement = () => (
  <Stack align="start">
    <InputGroup startElement={<LuPhone color="gray.300" />}>
      <Input type="tel" placeholder="Phone number" />
    </InputGroup>

    <InputGroup
      size="sm"
      startElement="$"
      endElement={<LuCheck color="green.500" />}
    >
      <Input placeholder="Enter amount" />
    </InputGroup>
  </Stack>
)

export function PasswordInput() {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <InputGroup
      size="md"
      endElement={
        <Button onClick={handleClick}>{show ? 'Hide' : 'Show'}</Button>
      }
    >
      <Input
        type={show ? 'text' : 'password'}
        placeholder="Enter password"
      />
    </InputGroup>
  )
}

export const WithFocusAndErrorColors = () => (
  <Stack align="start" gap="10">
    <Input focusBorderColor="lime" placeholder="Here is a sample placeholder" />

    <Input
      focusBorderColor="pink.400"
      placeholder="Here is a sample placeholder"
    />

    <Input
      invalid
      errorBorderColor="red.300"
      placeholder="Here is a sample placeholder"
    />

    <Input
      invalid
      errorBorderColor="crimson"
      placeholder="Here is a sample placeholder"
    />
  </Stack>
)

function FormError(props: any) {
  return (
    <FieldErrorText
      mt="0"
      bg="red.500"
      color="white"
      px="1"
      lineHeight="1em"
      borderRadius="sm"
      {...props}
    />
  )
}

export const WithField = () => {
  const [isError, setIsError] = React.useState(false)
  return (
    <Stack align="start">
      <FieldRoot id="first-name" invalid={isError}>
        <Box display="flex" mb="2">
          <FieldLabel mb="0" lineHeight="1em">
            Amount
          </FieldLabel>
          <FormError>is invalid!</FormError>
        </Box>
        <InputGroup size="sm" startElement="$" endAddon=".com">
          <Input placeholder="Enter amount" />
        </InputGroup>
        <FieldHelperText>Keep it very short and sweet!</FieldHelperText>
      </FieldRoot>
      <button onClick={() => setIsError(s => !s)}>Toggle Invalid</button>
    </Stack>
  )
}

export const WithInputElementBug = () => {
  const { open, onToggle } = useDisclosure({ defaultOpen: true })
  return (
    <>
      <button onClick={onToggle}>Toggle element</button>
      <InputGroup startElement={open ? 'O' : undefined}>
        <Input name="input" placeholder="placeholder" />
      </InputGroup>
    </>
  )
}

export const InputGroupCustomInputProps = () => {
  return (
    <>
      <InputGroup>
        <CustomInput m="10px" placeholder="should be flushed" />
      </InputGroup>
      <CustomInput m="10px" placeholder="is flushed" />
    </>
  )
}

const CustomInput = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => (
  <Input ref={ref} color="gray.600" variant="flushed" {...props} />
))
