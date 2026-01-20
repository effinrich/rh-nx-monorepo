import { useState } from 'react'
import { Wrap, WrapItem } from '@chakra-ui/react'

import { Container, SimpleGrid, Stack } from '../../index'

import { Radio, RadioGroup } from './radio'

export default {
  title: 'Components / Forms / Radio',
  decorators: [(story: any) => <Container mt="40px">{story()}</Container>]
}

export const Basic = () => (
  <RadioGroup.Root>
    <Radio value="hello">Hello</Radio>
  </RadioGroup.Root>
)

export const Disabled = () => (
  <RadioGroup.Root disabled>
    <Radio value="disabled">Disabled</Radio>
  </RadioGroup.Root>
)

export const Readonly = () => (
  <RadioGroup.Root readOnly colorPalette="green" size="lg">
    <Radio value="readonly" mt="40px">
      I'm a readonly radio
    </Radio>
  </RadioGroup.Root>
)

export const WithSizes = () => {
  const sizes = ['sm', 'md', 'lg'] as const

  return (
    <>
      {sizes.map(size => (
        <RadioGroup.Root key={size} size={size} colorPalette="green" ml="1rem">
          <Radio value="option">Option</Radio>
        </RadioGroup.Root>
      ))}
    </>
  )
}

export const _RadioGroup = () => {
  const [value, setValue] = useState('')
  return (
    <RadioGroup.Root value={value} onValueChange={e => setValue(e.value || '')}>
      <Stack>
        <Radio value="Option 1">Option 1</Radio>
        <Radio value="Option 2">Option 2</Radio>
        <Radio value="Option 3">Option 3</Radio>
      </Stack>
      <button onClick={() => setValue('')}>Clear</button>
    </RadioGroup.Root>
  )
}

export const GroupWithStack = () => {
  return (
    <RadioGroup.Root defaultValue="Option 1" onValueChange={console.log}>
      <Stack>
        <Radio value="Option 1">Option 1</Radio>
        <Radio value="Option 2">Option 2</Radio>
        <Radio value="Option 3">Option 3</Radio>
      </Stack>
    </RadioGroup.Root>
  )
}

export const GroupWithWrap = () => {
  const range = Array.from(Array(10)).map((_, i) => i + 1)
  return (
    <RadioGroup.Root onValueChange={console.log} defaultValue="Option 1">
      <Wrap gap={[2, 4, 6]}>
        {range.map(num => (
          <WrapItem key={num}>
            <Radio value={`Option ${num}`}>{`Option ${num}`}</Radio>
          </WrapItem>
        ))}
      </Wrap>
    </RadioGroup.Root>
  )
}

export const GroupWithSimpleGrid = () => {
  const range = Array.from(Array(10)).map((_, i) => i + 1)
  return (
    <RadioGroup.Root onValueChange={console.log} defaultValue="Option 1">
      <SimpleGrid columns={2} gap={[2, 4, 6]}>
        {range.map(num => (
          <Radio key={num} value={`Option ${num}`}>{`Option ${num}`}</Radio>
        ))}
      </SimpleGrid>
    </RadioGroup.Root>
  )
}

export const CustomRadioCard = () => {
  const options = ['react', 'vue', 'svelte']

  return (
    <RadioGroup.Root defaultValue="vue" onValueChange={console.log}>
      <Stack direction="row">
        {options.map(value => (
          <RadioGroup.Item
            key={value}
            value={value}
            px={5}
            py={3}
            border="1px solid gray"
            cursor="pointer"
            _checked={{ bg: 'tomato', color: 'white', borderColor: 'tomato' }}
            _focus={{ outline: '3px dotted red' }}
          >
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemText>{value}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </Stack>
    </RadioGroup.Root>
  )
}

export function DisabledRadioGroup() {
  return (
    <RadioGroup.Root disabled>
      <Stack>
        <Radio value="one">One</Radio>
        <Radio value="two" disabled>
          Two
        </Radio>
        <Radio value="three" disabled={false}>
          Three
        </Radio>
      </Stack>
    </RadioGroup.Root>
  )
}
