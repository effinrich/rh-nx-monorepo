import { Controller, useFormContext } from 'react-hook-form'
import analytics from '@redesignhealth/analytics'
import {
  IpMarketplaceFilters,
  IPSearchValues,
  useGetIPFilters
} from '@redesignhealth/portal/data-assets'
import { multiSelectTransformer } from '@redesignhealth/portal/utils'

import { Filter, FilterBox, Filters, Search } from '../../../filter-box'

const FILTER_CONFIG: Array<{
  displayName: string
  formName: keyof IpMarketplaceFilters
  keyForApi: string
}> = [
  {
    displayName: 'Organization types: All',
    formName: 'organizationTypeFilter',
    keyForApi: 'organizationType'
  },
  {
    displayName: 'Regions: All',
    formName: 'regionFilter',
    keyForApi: 'region'
  },
  {
    displayName: 'Specialities: All',
    formName: 'specialityFilter',
    keyForApi: 'speciality'
  },
  {
    displayName: 'Organs of focus: All',
    formName: 'organOfFocusFilter',
    keyForApi: 'organOfFocus'
  },
  {
    displayName: 'Technology types: All',
    formName: 'technologyTypeFilter',
    keyForApi: 'technologyType'
  }
]

const IPFilterBox = () => {
  const { data: filters, isPending } = useGetIPFilters()
  const { control, resetField, watch } = useFormContext<IPSearchValues>()

  analytics.useWatchSearchEvent(
    watch,
    FILTER_CONFIG.map(filters => filters.formName)
  )

  return (
    <FilterBox>
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
            handleClear={() =>
              FILTER_CONFIG.forEach(filterConfig =>
                resetField(filterConfig.formName)
              )
            }
          >
            {FILTER_CONFIG.map(filterConfig => (
              <Controller
                key={filterConfig.formName}
                name={filterConfig.formName}
                control={control}
                render={({ field: { name, value, onChange } }) => (
                  <Filter
                    isLoading={isPending}
                    isMulti
                    name={name}
                    options={filters[filterConfig.keyForApi]}
                    onChange={newValue =>
                      onChange(multiSelectTransformer.output(newValue))
                    }
                    placeholder={filterConfig.displayName}
                    value={multiSelectTransformer.input(
                      filters[filterConfig.keyForApi],
                      value
                    )}
                  />
                )}
              />
            ))}
          </Filters>
        )}
      </form>
    </FilterBox>
  )
}

export default IPFilterBox
