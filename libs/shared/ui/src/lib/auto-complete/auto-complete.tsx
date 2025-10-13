import styled from '@emotion/styled'
import { AsyncSelect, GroupBase, Props, Select } from 'chakra-react-select'

const StyledAutoComplete = styled.div``

export interface AutoCompleteProps {
  isAsync: boolean
}

export function AutoComplete<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: Props<Option, IsMulti, Group>, { isAsync = true }: AutoCompleteProps) {
  const { options } = props

  const formattedOptions = options?.map(t => ({
    value: t,
    label: t
  }))

  const filterColors = (inputValue: string) => {
    return formattedOptions?.filter((i: any) =>
      i['label'].toLowerCase().includes(inputValue.toLowerCase())
    )
  }

  const loadOptions = (
    inputValue: string,
    callback: (options: any) => void
  ) => {
    setTimeout(() => {
      callback(filterColors(inputValue))
    }, 1000)
  }

  return (
    <StyledAutoComplete>
      {isAsync ? (
        <AsyncSelect
          colorScheme="primary"
          cacheOptions
          loadOptions={loadOptions}
          defaultOptions
          {...props}
        />
      ) : (
        <Select
          colorScheme="primary"
          // options={options?.map((t: any) => ({ value: t, label: t }))}
          {...props}
        />
      )}
    </StyledAutoComplete>
  )
}

export default AutoComplete
