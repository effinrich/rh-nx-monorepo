import { MdOutlinePending } from 'react-icons/md'
import {
  Flex,
  Icon,
  List,
  ListItem,
  Loader,
  StarIcon,
  Text
} from '@redesignhealth/ui'

import { useOpcoEngagementsQuery } from '../hooks'

import { OpcoEngagementsPopover } from './opco-engagements-popover'

interface OpcoEngagementsProps {
  opcoName?: string
  advisorId?: string
}

export const OpcoEngagements = ({
  opcoName = '',
  advisorId = ''
}: OpcoEngagementsProps) => {
  const { data: engagements, isPending } = useOpcoEngagementsQuery(
    advisorId,
    opcoName
  )

  if (isPending) {
    return (
      <OpcoEngagementsPopover opcoName={opcoName}>
        <Loader size="md" />
      </OpcoEngagementsPopover>
    )
  }

  return (
    <OpcoEngagementsPopover opcoName={opcoName}>
      <List as={Flex} flexDir="column" gap="36px">
        {engagements?.map(engagement => {
          const reviewDate = new Date(engagement.reviewDate ?? '')

          const isRatingExist = typeof engagement.rating === 'number'
          const rating = engagement.rating ?? 0

          const blackStars = Array.from({ length: rating }, (_, i) => (
            <StarIcon key={i} color="gray.900" aria-hidden />
          ))

          const whiteStars = Array.from({ length: 5 - rating }, (_, i) => (
            <StarIcon
              key={i}
              stroke="gray.900"
              strokeWidth="1.75"
              color="white"
              aria-hidden
            />
          ))

          return (
            <ListItem key={engagement.id}>
              {!isNaN(reviewDate.getTime()) && (
                <Text aria-label="review date" fontSize="sm" color="gray.500">
                  {reviewDate.toLocaleDateString()}
                </Text>
              )}
              <Flex align="center" gap="5px">
                <Text
                  aria-label="reviewer name"
                  fontWeight="medium"
                  lineHeight="6"
                >
                  {engagement.reviewerName}
                  {engagement.type === 'Contract' && ' (Contract)'}
                </Text>
                {!isRatingExist && (
                  <Icon
                    as={MdOutlinePending}
                    mt="1px"
                    color="yellow.600"
                    title="In progress"
                  />
                )}
              </Flex>
              <Text
                aria-label="reviewer expertise"
                fontSize="sm"
                lineHeight="6"
              >
                {engagement.reviewerExpertise}
              </Text>
              {isRatingExist && (
                <Flex
                  aria-label={`rating ${rating} out of 5`}
                  gap="2px"
                  mt="6px"
                >
                  {blackStars}
                  {whiteStars}
                </Flex>
              )}
            </ListItem>
          )
        })}
      </List>
    </OpcoEngagementsPopover>
  )
}
