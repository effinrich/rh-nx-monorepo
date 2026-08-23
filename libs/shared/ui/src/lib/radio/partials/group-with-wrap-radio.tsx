import { Wrap, WrapItem } from '@chakra-ui/react'

import { Radio, RadioGroupRoot } from '../radio'

export function GroupWithWrapRadio() {
  const range = Array.from(Array(10)).map((_, i) => i + 1)
  return (
    <RadioGroupRoot
      onValueChange={({ value }) => console.log(value)}
      defaultValue="Option 1"
    >
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
