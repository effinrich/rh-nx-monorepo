export const sortFilterOptions = (
  options: { label?: string; value?: string }[]
) => {
  return options.sort((a, b) => (a.label || '').localeCompare(b.label || ''))
}
