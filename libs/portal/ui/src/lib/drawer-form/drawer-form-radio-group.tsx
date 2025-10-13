import { Box, Radio, RadioGroup } from '@redesignhealth/ui'

export const DrawerFormRadioGroup = (props: {
  options: Array<{ value: string; label?: string }>
  name?: string
  defaultValue?: string
  direction?: 'row' | 'column'
  isReadOnly?: boolean
  isDisabled?: boolean
}) => {
  return (
    <RadioGroup
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
            isReadOnly={props.isReadOnly}
            isDisabled={props.isDisabled}
            colorScheme="purple"
          >
            {option.label ?? option.value}
          </Radio>
        </Box>
      ))}
    </RadioGroup>
  )
}
