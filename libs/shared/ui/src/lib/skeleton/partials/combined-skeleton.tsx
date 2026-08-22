import { rh } from '../../../index'

import { SkeletonCircle, SkeletonText } from '../skeleton'

export function CombinedSkeleton() {
  return (
    <rh.div padding="6" boxShadow="lg" bg="white">
      <SkeletonCircle size="10" />
      <SkeletonText mt="4" lineClamp={4} gap="4" />
    </rh.div>
  )
}
