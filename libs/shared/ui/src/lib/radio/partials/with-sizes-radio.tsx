import { Radio, RadioGroupRoot } from '../radio'

export function WithSizesRadio() {
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
