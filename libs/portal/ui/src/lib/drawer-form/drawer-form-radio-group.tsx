import { Box, Radio, RadioGroupRoot } from '@redesignhealth/ui'

export const DrawerFormRadioGroup = (props: {
  options: Array<{ value: string; label?: string }>
  name?: string
  defaultValue?: string
  direction?: 'row' | 'column'
  readOnly?: boolean
  disabled?: boolean
}) => {
  return (
    <RadioGroupRoot
      name={props.name}
      defaultValue={props.defaultValue}
      display="flex"
      flexDir={props.direction ?? 'row'}
      gap="12px"
    >
      {props.options.map(option => (
        <Box
          px="16px"
          py="10px"
          borderColor="gray.300"
          borderWidth="1px"
          borderStyle="solid"
          borderRadius="8px"
          cursor="pointer"
          key={option.value}
          w="fit-content"
          _focusWithin={{ bg: 'primary.50', borderColor: 'primary.600' }}
        >
          <Radio
            value={option.value}
            disabled={props.disabled || props.readOnly}
          >
            {option.label ?? option.value}
          </Radio>
        </Box>
      ))}
    </RadioGroupRoot>
  )
}
