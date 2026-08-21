import type { HTMLAttributes } from 'react'

import { WrapItem } from '../wrap'

interface PlaceholderProps extends HTMLAttributes<HTMLDivElement> {
  width?: number
}

export function Placeholder({ width = 48, ...args }: PlaceholderProps) {
  return (
    <WrapItem>
      <div style={{ height: 48, width, background: 'red' }} {...args} />
    </WrapItem>
  )
}
