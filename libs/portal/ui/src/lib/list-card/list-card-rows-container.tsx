import { ListRoot, type ListRootProps } from '@redesignhealth/ui'

type ListCardRowsContainerProps = ListRootProps

export const ListCardRowsContainer = (props: ListCardRowsContainerProps) => {
  return <ListRoot variant="plain" {...props} />
}
