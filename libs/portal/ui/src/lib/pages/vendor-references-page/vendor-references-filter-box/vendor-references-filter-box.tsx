import { Controller, useFormContext } from 'react-hook-form'
import analytics from '@redesignhealth/analytics'
import {
  type VendorsProps,
  Option,
  useGetCategoriesFilters
} from '@redesignhealth/portal/data-assets'

import { Filter, FilterBox, Filters, Search } from '../../../filter-box'

export const VendorFilterBox = () => {
  const { control, setValue, watch } = useFormContext<VendorsProps>()
  const { data: filters, isPending } = useGetCategoriesFilters()
  const FILTER_CONFIG: {
    displayName: string
    name: keyof VendorsProps
    key: string
  }[] = [
    {
      displayName: 'Categories: all',
      name: 'categoryFilter',
      key: 'categories'
    },
    {
      displayName: 'Tags: all',
      name: 'subcategoryFilter',
      key: 'subcategories'
    }
  ]
  analytics.useWatchSearchEvent(
    watch,
    FILTER_CONFIG.map(f => f.name)
  )
  return (
    <FilterBox
      title="Looking for references on vendors?"
      description="Leverage the Redesign Health network to benefit from information already compiled by your peers on software vendors, agencies, contractors, and more. Look up a vendor by name to find others who are willing to discuss their experiences and share yours to contribute to our community."
      mb={8}
    >
      <form>
        <Controller
          name="query"
          control={control}
          render={({ field: { value, onChange, name } }) => (
            <Search
              defaultValue={value}
              onChange={onChange}
              name={name}
              placeholder="Search by name"
            />
          )}
        />
        {filters && (
          <Filters
            handleClear={() =>
              FILTER_CONFIG.forEach(filter => setValue(filter.name, []))
            }
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

export default VendorFilterBox
