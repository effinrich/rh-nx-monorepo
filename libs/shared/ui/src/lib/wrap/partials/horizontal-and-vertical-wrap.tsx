import { Wrap } from '../wrap'

import { Placeholder } from './placeholder'

export function HorizontalAndVerticalWrap() {
  return (
    <Wrap bg="pink" rowGap={['0px', '24px']} columnGap={['4px', '12px']}>
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
      <Placeholder />
    </Wrap>
  )
}
