/* eslint-disable no-console */
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { LoremIpsum } from 'react-lorem-ipsum'

import { Meta, StoryFn, StoryObj } from '@storybook/react-vite'

import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  rh,
  Stack
} from '../../index'

import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useNumberInput
} from './number-input'

export default {
  title: 'Components / Forms / NumberInput',
  decorators: [
    (story: any) => (
      <rh.div maxW="400px" mt="40px" mx="auto">
        {story()}
      </rh.div>
    )
  ]
} as Meta<typeof NumberInput>

export const Default: StoryObj<typeof NumberInput> = {
  render: args => (
    <NumberInput max={50} min={10} {...args}>
      <NumberInputField />
      <NumberInputStepper>
        <NumberIncrementStepper />
        <NumberDecrementStepper />
      </NumberInputStepper>
    </NumberInput>
  )
}

export const Basic: StoryFn<typeof NumberInput> = () => (
  <NumberInput max={50} min={10}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
)

const sizes = ['xs', 'sm', 'md', 'lg'] as const

export const Sizes: StoryFn<typeof NumberInput> = () => (
  <Stack gap="6">
    {sizes.map(size => (
      <rh.div key={size}>
        <pre>size = {size}</pre>
        <NumberInput mt="2" size={size} defaultValue={15} min={10}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </rh.div>
    ))}
  </Stack>
)
const UseNumberInput = (args: any) => {
  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    valueAsNumber
  } = useNumberInput({
    step: 0.01,
    defaultValue: 1.53,
    min: 1,
    max: 6,
    precision: 2,
    allowMouseWheel: true
  })

  return (
    <>
      <div>current: {valueAsNumber}</div>
      <LoremIpsum p={1} />
      <rh.div display="flex" {...args}>
        <Button {...getIncrementButtonProps()}>+</Button>
        <Input {...(getInputProps() as any)} />
        <Button {...getDecrementButtonProps()}>-</Button>
      </rh.div>
      <LoremIpsum p={1} />
    </>
  )
}

export const NumberInputHook = {
  render: (args: any) => <UseNumberInput {...args} />
}

const format = (val: string) => `$${val}`
const parse = (val: string) => val.replace(/^\$/, '')

export const FormatAndParse = () => {
  const [value, setValue] = React.useState<string>('1.53')

  const {
    getInputProps,
    getIncrementButtonProps,
    getDecrementButtonProps,
    valueAsNumber
  } = useNumberInput({
    step: 0.01,
    value: format(value),
    min: 1,
    max: 6,
    precision: 2,
    onChange: valueString => setValue(parse(valueString))
  })

  return (
    <>
      <div>current: {valueAsNumber}</div>
      <rh.div display="flex">
        <Button {...getIncrementButtonProps()}>+</Button>
        <Input {...getInputProps()} />
        <Button {...getDecrementButtonProps()}>-</Button>
      </rh.div>
    </>
  )
}

export const WithMinAndMax = () => (
  <NumberInput defaultValue={15} min={10} max={20}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
)

export const WithStep = () => (
  <NumberInput step={5} defaultValue={15} min={10} max={30}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
)

export const WithPrecision = () => (
  <NumberInput defaultValue={15} precision={2} step={0.2}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
)

export const WithClampValueDisabled = () => (
  <NumberInput defaultValue={15} max={30} clampValueOnBlur={false}>
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
)

export const AllowOutOfRange = () => (
  <NumberInput
    defaultValue={15}
    max={10}
    keepWithinRange={false}
    clampValueOnBlur={false}
  >
    <NumberInputField />
    <NumberInputStepper>
      <NumberIncrementStepper />
      <NumberDecrementStepper />
    </NumberInputStepper>
  </NumberInput>
)

export const WithReactHookForm = () => {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      sales: 12
    }
  })

  const onSubmit = (data: any) => console.log(data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <NumberInput
        name="sales"
        onBlur={() => {
          console.log('blurred')
        }}
      >
        <NumberInputField {...register('sales')} />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </form>
  )
}

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
  const [isError, setIsError] = React.useState(false)

  return (
    <Stack align="start">
      <FormControl id="first-name" invalid={isError}>
        <rh.div display="flex" mb="2">
          <FormLabel mb="0" lineHeight="1em">
            Amount
          </FormLabel>
          <FormError>is invalid!</FormError>
        </rh.div>
        <NumberInput
          max={50}
          min={10}
          defaultValue={20}
          onBlur={() => {
            console.log('blurred')
          }}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormHelperText>Keep it very short and sweet!</FormHelperText>
      </FormControl>
      <Button onClick={() => setIsError(s => !s)}>Toggle Invalid</Button>
    </Stack>
  )
}
