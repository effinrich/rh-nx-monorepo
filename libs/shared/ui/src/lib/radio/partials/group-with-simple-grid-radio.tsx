import { SimpleGrid } from '../../../index'
import { Radio, RadioGroupRoot } from '../radio'

export function GroupWithSimpleGridRadio() {
  const range = Array.from(Array(10)).map((_, i) => i + 1)
  return (
    <RadioGroupRoot
      onValueChange={({ value }) => console.log(value)}
      defaultValue="Option 1"
    >
      <SimpleGrid columns={2} gap={[2, 4, 6]}>
        {range.map(num => (
          <Radio key={num} value={`Option ${num}`}>{`Option ${num}`}</Radio>
        ))}
      </SimpleGrid>
    </RadioGroupRoot>
  )
}
