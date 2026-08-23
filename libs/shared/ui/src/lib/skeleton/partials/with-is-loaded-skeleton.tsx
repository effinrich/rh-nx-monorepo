import { useEffect, useState } from 'react'

import { rh } from '../../../index'
import { Skeleton, SkeletonText } from '../skeleton'

export function WithIsLoadedSkeleton() {
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    const intervalId = setInterval(() => setHasLoaded(x => !x), 1000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <rh.div>
      <rh.div h="100px" borderWidth="1px">
        Content
      </rh.div>
      <Skeleton w="100px" loading={!hasLoaded} mt={2}>
        <span>Redesign UI is dope</span>
      </Skeleton>
      <SkeletonText loading={!hasLoaded} mt={2}>
        <p>Redesign UI is dope</p>
      </SkeletonText>
      <rh.div h="100px" borderWidth="1px" mt={2}>
        Content
      </rh.div>
    </rh.div>
  )
}
