import { Box } from '@redesignhealth/ui'
import { GroupBase, Props, Select } from 'chakra-react-select'

type FilterProps<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
> = Props<Option, IsMulti, Group>

export const Filter = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: FilterProps<Option, IsMulti, Group>
) => {
  return (
    <Box width={['100%', '100%', 'initial']} data-testid={props.name}>
      <Select size="sm" {...props} />
    </Box>
  )
}

export default Filter
