import { memo } from 'react'
import { FormControl, FormLabel } from '@redesignhealth/ui'
import { Select } from 'chakra-react-select'

import { useAllAdvisorsQuery } from '../hooks'
import { FilterName } from '../types'

interface FilterProps {
  name: FilterName
  label: string
  badgeColor: 'blue' | 'green' | 'gray'
  onChange: (name: FilterName, newValues: Array<string>) => void
}

export const Filter = memo(
  ({ badgeColor, label, name, onChange }: FilterProps) => {
    const { isPending, data: advisors = [] } = useAllAdvisorsQuery()
    const options = new Set<string>()

    for (const advisor of advisors) {
      if (!advisor[name]) continue
      advisor[name]?.forEach(option => options.add(option))
    }

    return (
      <FormControl>
        <FormLabel
          fontSize="sm"
          color="gray.600"
          fontWeight="semibold"
          lineHeight="none"
          letterSpacing="tight"
        >
          {label}
        </FormLabel>
        <Select
          placeholder=""
          colorScheme={badgeColor}
          isMulti
          isLoading={isPending}
          options={[...options].map(option => ({
            value: option,
            label: option
          }))}
          onChange={options => {
            const newValues = options.map(option => option.value)
            onChange(name, newValues)
          }}
        />
      </FormControl>
    )
  }
)

Filter.displayName = 'Filter'
