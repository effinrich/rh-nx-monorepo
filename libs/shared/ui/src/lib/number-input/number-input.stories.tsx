/* eslint-disable no-console */
import * as React from 'react'
import { useForm } from 'react-hook-form'
import { LoremIpsum } from 'react-lorem-ipsum'

import { Meta, StoryFn, StoryObj } from '@storybook/react-vite'

import {
  Button,
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRoot,
  Input,
  rh,
  Stack
} from '../../index'

import {
  NumberInputDecrementTrigger,
  NumberInputIncrementTrigger,
  NumberInputRoot,
  NumberInputInput,
  NumberInputControl,
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
} as Meta<typeof NumberInputRoot>

export const Default: StoryObj<typeof NumberInputRoot> = {
  render: args => (
    <NumberInputRoot max={50} min={10} {...args}>
      <NumberInputInput />
      <NumberInputControl>
        <NumberInputIncrementTrigger />
        <NumberInputDecrementTrigger />
      </NumberInputControl>
    </NumberInputRoot>
  )
}

export const Basic: StoryFn<typeof NumberInputRoot> = () => (
  <NumberInputRoot max={50} min={10}>
    <NumberInputInput />
    <NumberInputControl>
      <NumberInputIncrementTrigger />
      <NumberInputDecrementTrigger />
    </NumberInputControl>
  </NumberInputRoot>
)

const sizes = ['xs', 'sm', 'md', 'lg'] as const

export const Sizes: StoryFn<typeof NumberInputRoot> = () => (
  <Stack gap="6">
    {sizes.map(size => (
      <rh.div key={size}>
        <pre>size = {size}</pre>
        <NumberInputRoot mt="2" size={size} defaultValue={15} min={10}>
          <NumberInputInput />
          <NumberInputControl>
            <NumberInputIncrementTrigger />
            <NumberInputDecrementTrigger />
          </NumberInputControl>
        </NumberInputRoot>
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
    onValueChange: ({ value }) => setValue(parse(value))
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
  <NumberInputRoot defaultValue={15} min={10} max={20}>
    <NumberInputInput />
    <NumberInputControl>
      <NumberInputIncrementTrigger />
      <NumberInputDecrementTrigger />
    </NumberInputControl>
  </NumberInputRoot>
)

export const WithStep = () => (
  <NumberInputRoot step={5} defaultValue={15} min={10} max={30}>
    <NumberInputInput />
    <NumberInputControl>
      <NumberInputIncrementTrigger />
      <NumberInputDecrementTrigger />
    </NumberInputControl>
  </NumberInputRoot>
)

export const WithPrecision = () => (
  <NumberInputRoot defaultValue={15} precision={2} step={0.2}>
    <NumberInputInput />
    <NumberInputControl>
      <NumberInputIncrementTrigger />
      <NumberInputDecrementTrigger />
    </NumberInputControl>
  </NumberInputRoot>
)

export const WithClampValueDisabled = () => (
  <NumberInputRoot defaultValue={15} max={30} clampValueOnBlur={false}>
    <NumberInputInput />
    <NumberInputControl>
      <NumberInputIncrementTrigger />
      <NumberInputDecrementTrigger />
    </NumberInputControl>
  </NumberInputRoot>
)

export const AllowOutOfRange = () => (
  <NumberInputRoot
    defaultValue={15}
    max={10}
    keepWithinRange={false}
    clampValueOnBlur={false}
  >
    <NumberInputInput />
    <NumberInputControl>
      <NumberInputIncrementTrigger />
      <NumberInputDecrementTrigger />
    </NumberInputControl>
  </NumberInputRoot>
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
      <NumberInputRoot
        name="sales"
        onBlur={() => {
          console.log('blurred')
        }}
      >
        <NumberInputInput {...register('sales')} />
        <NumberInputControl>
          <NumberInputIncrementTrigger />
          <NumberInputDecrementTrigger />
        </NumberInputControl>
      </NumberInputRoot>
    </form>
  )
}

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
        <rh.div display="flex" mb="2">
          <FieldLabel mb="0" lineHeight="1em">
            Amount
          </FieldLabel>
          <FormError>is invalid!</FormError>
        </rh.div>
        <NumberInputRoot
          max={50}
          min={10}
          defaultValue={20}
          onBlur={() => {
            console.log('blurred')
          }}
        >
          <NumberInputInput />
          <NumberInputControl>
            <NumberInputIncrementTrigger />
            <NumberInputDecrementTrigger />
          </NumberInputControl>
        </NumberInputRoot>
        <FieldHelperText>Keep it very short and sweet!</FieldHelperText>
      </FieldRoot>
      <Button onClick={() => setIsError(s => !s)}>Toggle Invalid</Button>
    </Stack>
  )
}
