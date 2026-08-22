import { useEffect, useState } from 'react'

import { Skeleton } from '../skeleton'

export function WithNoFadeSkeleton() {
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setHasLoaded(true), 1000)
  }, [])

  return (
    <Skeleton fadeDuration={0} isLoaded={hasLoaded}>
      <span>Redesign UI is dope</span>
    </Skeleton>
  )
}
