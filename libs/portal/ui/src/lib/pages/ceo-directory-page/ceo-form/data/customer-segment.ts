import { Option } from '@redesignhealth/portal/data-assets'

export const customerSegment: Option[] = [
  { value: 'HEALTH_PLAN', label: 'Health plans' },
  { value: 'HEALTH_SYSTEMS', label: 'Health systems' },
  {
    value: 'PHYSICIAN_OR_PROVIDER_PRACTICES',
    label: 'Physician/Provider practices'
  },
  { value: 'CONSUMER', label: 'Consumer' },
  { value: 'EMPLOYER', label: 'Employer' }
]
