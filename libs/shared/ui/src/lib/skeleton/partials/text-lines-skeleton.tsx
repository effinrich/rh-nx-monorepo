import { LoremIpsum } from 'react-lorem-ipsum'

import { SkeletonText } from '../skeleton'

export function TextLinesSkeleton() {
  return (
    <SkeletonText
      padding="20px"
      borderWidth="1px"
      borderRadius="lg"
      lineClamp={[3, 4, 5, 6, 7]}
    >
      <LoremIpsum p={2} avgSentencesPerParagraph={4} />
    </SkeletonText>
  )
}
