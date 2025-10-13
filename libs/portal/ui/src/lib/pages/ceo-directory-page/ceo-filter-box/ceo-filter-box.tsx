import { Controller, useFormContext } from 'react-hook-form'
import analytics from '@redesignhealth/analytics'
import {
  CeoSearchValues,
  Option,
  useGetCeoFilters
} from '@redesignhealth/portal/data-assets'

import { Filter, FilterBox, Filters, Search } from '../../../filter-box'

const FILTER_CONFIG: {
  displayName: string
  name: keyof CeoSearchValues
  key: string
}[] = [
  {
    displayName: 'Fundraise stage',
    name: 'fundraiseStatusFilter',
    key: 'member.company.fundraiseStatus'
  },
  {
    displayName: 'Healthcare sector',
    name: 'healthcareSectorFilter',
    key: 'healthcareSector'
  },
  {
    displayName: 'Business focus area',
    name: 'businessFocusAreaFilter',
    key: 'businessFocusArea'
  },
  {
    displayName: 'Customer segment',
    name: 'customerSegmentFilter',
    key: 'customerSegment'
  },
  {
    displayName: 'Business type',
    name: 'businessTypeFilter',
    key: 'businessType'
  }
]

const CeoFilterBox = () => {
  const { data: filters, isPending } = useGetCeoFilters()
  const { control, resetField, watch } = useFormContext<CeoSearchValues>()
  analytics.useWatchSearchEvent(
    watch,
    FILTER_CONFIG.map(filters => filters.name)
  )
  return (
    <FilterBox
      title="Looking to connect with other CEOs?"
      description="Browse our directory to connect with your peers."
    >
      <form>
        <Controller
          name="query"
          control={control}
          render={({ field: { value, onChange, name } }) => (
            <Search defaultValue={value} onChange={onChange} name={name} />
          )}
        />
        {filters && (
          <Filters
            handleClear={() => FILTER_CONFIG.forEach(f => resetField(f.name))}
          >
            {FILTER_CONFIG.map(filter => (
              <Controller
                key={filter.name}
                name={filter.name}
                control={control}
                render={({ field: { name, value, onChange } }) => (
                  <Filter
                    name={name}
                    value={value as Option[]}
                    isLoading={isPending}
                    options={filters[filter.key]}
                    onChange={event => onChange(event as Option[])}
                    placeholder={filter.displayName}
                    isMulti
                  />
                )}
              />
            ))}
          </Filters>
        )}
        <input type="hidden" name="sort" />
      </form>
    </FilterBox>
  )
}

export default CeoFilterBox
