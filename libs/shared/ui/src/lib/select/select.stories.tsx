import { useState } from 'react'

import { Meta } from '@storybook/react-vite'

import { Container, Stack } from '../../index'

import { NativeSelectRoot, NativeSelectField } from './select'

export default {
  component: NativeSelectRoot,
  title: 'Components / Forms / Select',
  decorators: [
    story => (
      <Container maxWidth="400px" mt="40px">
        {story()}
      </Container>
    )
  ]
} as Meta

export const BasicUsage = () => (
  <NativeSelectRoot color="primary.600">
    <NativeSelectField placeholder="Select option">
      <option value="Option 1">Option 1</option>
      <option value="Option 2">Option 2</option>
      <option value="Option 3">Option 3</option>
    </NativeSelectField>
  </NativeSelectRoot>
)

export const SelectStates = () => (
  <Stack>
    <NativeSelectRoot invalid mb={4}>
      <NativeSelectField placeholder="Select option">
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
      </NativeSelectField>
    </NativeSelectRoot>

    <NativeSelectRoot disabled>
      <NativeSelectField placeholder="Select option">
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
      </NativeSelectField>
    </NativeSelectRoot>
  </Stack>
)

export const SelectVariants = () => (
  <Stack>
    <NativeSelectRoot variant="outline" mb={4}>
      <NativeSelectField placeholder="Select option outline">
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
      </NativeSelectField>
    </NativeSelectRoot>

    <NativeSelectRoot variant="filled" mb={4}>
      <NativeSelectField placeholder="Select option filled">
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
      </NativeSelectField>
    </NativeSelectRoot>

    <NativeSelectRoot variant="flushed" mb={4}>
      <NativeSelectField placeholder="Select option flushed">
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
      </NativeSelectField>
    </NativeSelectRoot>

    <NativeSelectRoot variant="unstyled" mt={4}>
      <NativeSelectField placeholder="Select option unstyled">
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
      </NativeSelectField>
    </NativeSelectRoot>
  </Stack>
)

export const SelectSizes = () => (
  <Stack gap={6}>
    {['xs', 'sm', 'md', 'lg'].map(size => (
      <NativeSelectRoot size={size} key={size}>
        <NativeSelectField placeholder={`${size} size`} />
      </NativeSelectRoot>
    ))}
  </Stack>
)

export const SelectControlled = () => {
  const [value, setValue] = useState('')
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value)
  }

  return (
    <NativeSelectRoot>
      <NativeSelectField
        value={value}
        onChange={handleChange}
        placeholder="Controlled select"
      >
        <option value="Option 1">Option 1</option>
        <option value="Option 2">Option 2</option>
        <option value="Option 3">Option 3</option>
      </NativeSelectField>
    </NativeSelectRoot>
  )
}

export const FocusAndErrorColors = () => (
  <Stack>
    <NativeSelectRoot>
      <NativeSelectField placeholder="Here is a sample placeholder" />
    </NativeSelectRoot>

    <NativeSelectRoot invalid>
      <NativeSelectField placeholder="Here is a sample placeholder" />
    </NativeSelectRoot>
  </Stack>
)

export const OverrideStyles = () => (
  <NativeSelectRoot color="white" height="60px" bg="tomato">
    <NativeSelectField placeholder="Woohoo! A new background color!" />
  </NativeSelectRoot>
)
