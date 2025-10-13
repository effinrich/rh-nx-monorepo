import { Option } from '@redesignhealth/portal/data-assets'

export const businessType: Option[] = ['B2B', 'B2B2C', 'D2C'].map(e => ({
  value: e,
  label: e
}))
