import { memo } from 'react'
import { FieldLabel, FieldRoot } from '@redesignhealth/ui'
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
      <FieldRoot>
        {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
        <FieldLabel
          fontSize="sm"
          color="gray.600"
          fontWeight="semibold"
          lineHeight="none"
          letterSpacing="tight"
        >
          {label}
        </FieldLabel>
        <Select
          placeholder=""
          colorPalette={badgeColor}
          isMulti
          loading={isPending}
          options={[...options].map(option => ({
            value: option,
            label: option
          }))}
          onChange={options => {
            const newValues = options.map(option => option.value)
            onChange(name, newValues)
          }}
        />
      </FieldRoot>
    )
  }
)

Filter.displayName = 'Filter'
