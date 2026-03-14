import { HStack, TagRoot, TagLabel } from '@redesignhealth/ui'

export interface ListCardTagProps {
  values?: string[]
}

export const ListCardTags = ({ values }: ListCardTagProps) => {
  return (
    <HStack flex={1} gap={4} wrap="wrap">
      {values?.map(value => (
        <TagRoot key={value} variant="solid">
          <TagLabel>{value}</TagLabel>
        </TagRoot>
      ))}
    </HStack>
  )
}
