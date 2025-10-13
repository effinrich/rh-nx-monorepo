export const createFilterParam = (
  name: string,
  values: { value: string }[]
): [string, string] => [
  'filter',
  `${name},${values.map(o => o.value).join('|')}`
]

export const createFilterParamFromStringArray = (
  name: string,
  values: string[]
): [string, string] => ['filter', `${name},${values.join('|')}`]

export const createExpandParams = (expand?: string[]): [string, string][] =>
  (expand || []).map(expansion => ['expand', expansion])

export const createSortParam = (option: string): [string, string] => [
  'sort',
  option
]
