import { Badge, Flex } from '@redesignhealth/ui'

interface TotalCountProps {
  totalUsers: number | undefined
}
const TotalCount = ({ totalUsers }: TotalCountProps) => {
  return (
    <Flex align="center" px="24px" py="20px">
      <Badge
        colorScheme="primary"
        size="sm"
        variant="subtle"
        textTransform="capitalize"
      >
        {totalUsers} total
      </Badge>
    </Flex>
  )
}

export default TotalCount
