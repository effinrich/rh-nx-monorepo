import { Skeleton } from '../skeleton'

export function WithStartAndEndColorSkeleton() {
  return (
    <Skeleton
      h="20px"
      css={{
        '--start-color': 'colors.red.200',
        '--end-color': 'colors.green.200'
      }}
    />
  )
}
