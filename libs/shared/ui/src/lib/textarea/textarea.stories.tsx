/* eslint-disable react/no-children-prop */
import { useState } from 'react'
import { Radio, RadioGroup } from '@chakra-ui/react'
import { ResponsiveValue } from '@chakra-ui/system'

import { Meta } from '@storybook/react-vite'

import {
  Box,
  Container,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  HStack,
  Stack,
  Text,
  VStack
} from '../../index'

import { Textarea } from './textarea'

export default {
  component: Textarea,
  title: 'Components / Forms / Textarea',
  decorators: [
    Story => (
      <Container>
        <Story />
      </Container>
    )
  ]
} as Meta

export const Basic = () => (
  <Textarea placeholder="Here is a sample placeholder" />
)

export const WithControlled = () => {
  const [value, setValue] = useState('')

  const handleInputChange = (e: any) => {
    const inputValue = e.target.value
    setValue(inputValue)
  }
  return (
    <>
      <Text mb="8px">Value: {value}</Text>
      <Textarea
        value={value}
        onChange={handleInputChange}
        placeholder="Here is a sample placeholder"
        size="sm"
      />
    </>
  )
}

export const WithResize = () => {
  const [resize, setResize] = useState<ResponsiveValue<any>>('horizontal')

  return (
    <>
      <RadioGroup defaultValue={resize} onChange={setResize} mb={6}>
        <HStack direction="row" spacing={5}>
          <Radio value="horizontal">Horizontal</Radio>
          <Radio value="vertical">Vertical</Radio>
          <Radio value="none">None</Radio>
        </HStack>
      </RadioGroup>

      <Textarea
        placeholder="Here is a sample placeholder"
        size="sm"
        resize={resize}
      />
    </>
  )
}

export const WithSizes = () => (
  <VStack align="start" spacing={8}>
    {['xs', 'sm', 'md', 'lg'].map(size => (
      <Textarea
        key={size}
        size={size}
        placeholder={`This is a ${size} textarea`}
      />
    ))}
  </VStack>
)

export const WithStates = () => (
  <Stack align="start" spacing={8}>
    <Textarea placeholder="Idle" />
    <Textarea isInvalid placeholder="isInvalid" />
    <Textarea isDisabled placeholder="isDisabled" />
    <Textarea isReadOnly placeholder="isReadonly" />
  </Stack>
)

export const WithVariants = () => (
  <Stack align="start" spacing={8}>
    <Textarea variant="outline" placeholder="Outline" />
    <Textarea variant="filled" placeholder="Filled" />
    <Textarea variant="flushed" placeholder="Flushed" />
    <Textarea variant="unstyled" placeholder="Unstyled" />
  </Stack>
)

export const WithFocusAndErrorColors = () => (
  <Stack align="start" spacing={10}>
    <Textarea
      focusBorderColor="lime"
      placeholder="Here is a sample placeholder"
    />

    <Textarea
      focusBorderColor="pink.400"
      placeholder="Here is a sample placeholder"
    />

    <Textarea
      isInvalid
      errorBorderColor="red.300"
      placeholder="Here is a sample placeholder"
    />

    <Textarea
      isInvalid
      errorBorderColor="crimson"
      placeholder="Here is a sample placeholder"
    />
  </Stack>
)

function FormError(props: any) {
  return (
    <FormErrorMessage
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

export const WithFormControl = () => {
  const [isError, setIsError] = useState(false)
  return (
    <Stack align="start">
      <FormControl id="first-name" isInvalid={isError}>
        <Box display="flex" mb="2">
          <FormLabel mb="0" lineHeight="1em">
            Amount
          </FormLabel>
          <FormError>is invalid!</FormError>
        </Box>
        <Textarea placeholder="Enter amount" />
        <FormHelperText>Keep it very short and sweet!</FormHelperText>
      </FormControl>
      <button onClick={() => setIsError(s => !s)}>Toggle Invalid</button>
    </Stack>
  )
}
