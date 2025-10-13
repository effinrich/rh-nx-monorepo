import { HStack, Tag } from '@redesignhealth/ui'

export interface ListCardTagProps {
  values?: string[]
}

export const ListCardTags = ({ values }: ListCardTagProps) => {
  return (
    <HStack flex={1} spacing={4} wrap="wrap">
      {values?.map(value => (
        <Tag key={value} variant="solid">
          {value}
        </Tag>
      ))}
    </HStack>
  )
}
