import { useEffect, useState } from 'react'

import { SkeletonText } from '../skeleton'

export function WithFadeTextSkeleton() {
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setHasLoaded(true), 1000)
  }, [])

  return (
    <SkeletonText loading={!hasLoaded}>
      <span>Redesign UI is dope</span>
    </SkeletonText>
  )
}
