import { useEffect, useState } from 'react'

import { Skeleton } from '../skeleton'

export function WithFadeSkeleton() {
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    setTimeout(() => setHasLoaded(true), 1000)
  }, [])

  return (
    <Skeleton loading={!hasLoaded}>
      <span>Redesign UI is dope</span>
    </Skeleton>
  )
}
