import { Skeleton } from '../skeleton'

export function WithFadeAlreadyLoadedSkeleton() {
  return (
    <Skeleton loading={false}>
      <span>This should not fade in</span>
    </Skeleton>
  )
}
