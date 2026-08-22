import { AvatarFallback, AvatarGroup, AvatarRoot } from '../avatar'

import { GenericAvatar } from './generic-avatar'

export function WithCustomIconAvatar() {
  return (
    <AvatarGroup>
      <AvatarRoot icon={<GenericAvatar />}>
        <AvatarFallback />
      </AvatarRoot>
      <AvatarRoot>
        <AvatarFallback />
      </AvatarRoot>
    </AvatarGroup>
  )
}
