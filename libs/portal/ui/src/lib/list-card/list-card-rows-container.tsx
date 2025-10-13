import { List, ListProps } from '@redesignhealth/ui'

type ListCardRowsContainerProps = ListProps

export const ListCardRowsContainer = (props: ListCardRowsContainerProps) => {
  return <List variant="striped" {...props} />
}
