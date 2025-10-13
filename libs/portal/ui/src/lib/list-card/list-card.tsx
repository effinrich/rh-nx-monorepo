import { type CardProps, Card } from '@redesignhealth/ui'

import { ListCardHeader } from './list-card-header'
import { ListCardRow } from './list-card-row'
import { ListCardRowsContainer } from './list-card-rows-container'

type ListCardProps = CardProps

export const ListCard = (props: ListCardProps) => {
  return <Card {...props} variant="outline" borderRadius="12px" />
}

ListCard.Header = ListCardHeader
ListCard.Row = ListCardRow
ListCard.RowsContainer = ListCardRowsContainer
