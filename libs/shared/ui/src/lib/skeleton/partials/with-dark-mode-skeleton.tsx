import { rh, Stack } from '../../../index'

import { Skeleton } from '../skeleton'

export function WithDarkModeSkeleton() {
  return (
    <Stack colorPalette="gray" data-theme="dark">
      <rh.p>Some text</rh.p>
      <Skeleton boxSize="100px" />
      <Skeleton boxSize="100px" />
      <Skeleton boxSize="100px" />
    </Stack>
  )
}
