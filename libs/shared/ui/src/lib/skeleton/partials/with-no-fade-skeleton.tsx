import { useEffect, useState } from 'react'

import { Skeleton } from '../skeleton'

export function WithNoFadeSkeleton() {
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setHasLoaded(true), 1000)
  }, [])

  return (
    <Skeleton css={{ '--fade-duration': '0s' }} loading={!hasLoaded}>
      <span>Redesign UI is dope</span>
    </Skeleton>
  )
}
