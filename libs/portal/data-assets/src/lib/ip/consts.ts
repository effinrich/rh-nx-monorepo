import { Option } from '../types'
export const IP_MARKETPLACE_DEFAULT_VALUES = {
  query: '',
  organizationTypeFilter: [],
  regionFilter: [],
  specialityFilter: [],
  organOfFocusFilter: [],
  technologyTypeFilter: [],
  sort: 'createdDate,desc'
}

export const IP_MARKETPLACE_SORT_OPTIONS: Option[] = [
  {
    label: 'Newest',
    value: 'createdDate,desc'
  },
  {
    label: 'Oldest',
    value: 'createdDate,asc'
  }
]
