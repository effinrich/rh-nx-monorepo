/* eslint-disable no-console */
import * as React from 'react'
import { Wrap, WrapItem } from '@chakra-ui/react'
import { expect, userEvent, within } from 'storybook/test'

import { Container, SimpleGrid, Stack } from '../../index'

import {
  Radio,
  RadioGroupRoot
} from './radio'

export default {
  title: 'Components / Forms / Radio',
  decorators: [(story: any) => <Container mt="40px">{story()}</Container>]
}

export const Basic = () => (
  <RadioGroupRoot>
    <Radio value="hello">Hello</Radio>
  </RadioGroupRoot>
)

export const Disabled = () => (
  <RadioGroupRoot>
    <Radio value="disabled" disabled>
      Disabled
    </Radio>
  </RadioGroupRoot>
)

export const Readonly = () => (
  <RadioGroupRoot defaultValue="readonly">
    <Radio value="readonly" readOnly size="lg" colorPalette="green">
      I'm a readonly radio
    </Radio>
  </RadioGroupRoot>
)

export const Interactive = {
  render: () => (
    <RadioGroupRoot>
      <Radio value="one">One</Radio>
      <Radio value="two">Two</Radio>
    </RadioGroupRoot>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByText('One'))
    await expect(canvas.getByRole('radio', { name: 'One' })).toBeChecked()
  }
}

export const WithSizes = () => {
  const sizes = ['sm', 'md', 'lg']

  return (
    <>
      <RadioGroupRoot>
        {sizes.map(size => (
          <Radio
            key={size}
            size={size}
            value={size}
            ml="1rem"
            colorPalette="green"
          >
            Option
          </Radio>
        ))}
      </RadioGroupRoot>
    </>
  )
}

export const _RadioGroup = () => {
  const [value, setValue] = React.useState('')
  return (
    <RadioGroupRoot value={value} onChange={setValue}>
      <Stack>
        <Radio value="Option 1">Option 1</Radio>
        <Radio value="Option 2">Option 2</Radio>
        <Radio value="Option 3">Option 3</Radio>
      </Stack>
      <button onClick={() => setValue('')}>Clear</button>
    </RadioGroupRoot>
  )
}

export const GroupWithStack = () => {
  return (
    <RadioGroupRoot defaultValue="Option 1" onChange={console.log}>
      <Stack>
        <Radio value="Option 1">Option 1</Radio>
        <Radio value="Option 2">Option 2</Radio>
        <Radio value="Option 3">Option 3</Radio>
      </Stack>
    </RadioGroupRoot>
  )
}

export const GroupWithWrap = () => {
  const range = Array.from(Array(10)).map((_, i) => i + 1)
  return (
    <RadioGroupRoot onChange={console.log} defaultValue="Option 1">
      <Wrap gap={[2, 4, 6]}>
        {range.map(num => (
          <WrapItem key={num}>
            <Radio value={`Option ${num}`}>{`Option ${num}`}</Radio>
          </WrapItem>
        ))}
      </Wrap>
    </RadioGroupRoot>
  )
}

export const GroupWithSimpleGrid = () => {
  const range = Array.from(Array(10)).map((_, i) => i + 1)
  return (
    <RadioGroupRoot onChange={console.log} defaultValue="Option 1">
      <SimpleGrid columns={2} gap={[2, 4, 6]}>
        {range.map(num => (
          <Radio key={num} value={`Option ${num}`}>{`Option ${num}`}</Radio>
        ))}
      </SimpleGrid>
    </RadioGroupRoot>
  )
}

export function DisabledRadioGroup() {
  return (
    <RadioGroupRoot disabled>
      <Stack>
        <Radio value="one">One</Radio>
        <Radio value="two" disabled>
          Two
        </Radio>
        <Radio value="three" disabled={false}>
          Three
        </Radio>
      </Stack>
    </RadioGroupRoot>
  )
}
