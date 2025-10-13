import { Option } from '@redesignhealth/portal/data-assets'

export const locations: Option[] = [
  'Atlanta',
  'Austin',
  'Boise',
  'Boston',
  'Denver/Boulder',
  'Indianapolis',
  'Minneapolis',
  'NYC',
  'Orlando/Jacksonville',
  'Philadelphia',
  'Portland',
  'Raleigh',
  'Reno',
  'San Francisco',
  'Seattle',
  'St. Louis',
  'Tampa',
  'Washington DC'
].map(e => ({ value: e, label: e }))
