import { Skeleton } from '../skeleton'

export function WithFadeAlreadyLoadedSkeleton() {
  return (
    <Skeleton isLoaded>
      <span>This should not fade in</span>
    </Skeleton>
  )
}
