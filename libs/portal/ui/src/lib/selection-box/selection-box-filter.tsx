import { Box, BoxProps } from '@redesignhealth/ui'
import { Select } from 'chakra-react-select'

interface SelectionBoxFilterProps {
  placeholder?: string
  options?: Array<string | undefined>
  onChange?: (newValues: Array<string>) => void
  pr?: BoxProps['pr']
  testid?: string
}

export const SelectionBoxFilter = ({
  options = [],
  onChange,
  placeholder,
  pr,
  testid
}: SelectionBoxFilterProps) => {
  const validOptions = options.filter(o => Boolean(o)) as Array<string>
  const uniqueOptions = [...new Set(validOptions)]
  const parsedOptions = uniqueOptions.map(o => ({ value: o, label: o }))

  return (
    <Box w={['full', 'full', '33%', '33%']} pb={3} pr={pr} data-testid={testid}>
      <Select
        placeholder={placeholder}
        options={parsedOptions}
        isMulti
        onChange={newValues => onChange?.(newValues?.map(({ value }) => value))}
      />
    </Box>
  )
}

SelectionBoxFilter.displayName = 'SelectionBoxFilter'
