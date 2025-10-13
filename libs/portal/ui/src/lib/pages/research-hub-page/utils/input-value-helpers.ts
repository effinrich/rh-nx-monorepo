import { CompanySummary, Option } from '@redesignhealth/portal/data-assets'

export const transformOptionsFormat = (
  options: string[] | undefined
): Option[] | undefined => {
  return options?.map(option => ({
    value: option,
    label: option
  }))
}

export const sortOptionsAlphabetically = (options: CompanySummary[]) => {
  return options?.sort((a, b) =>
    a.name.localeCompare(b.name, 'en', { sensitivity: 'base' })
  )
}
