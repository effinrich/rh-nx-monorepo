import { AvatarFallback, AvatarGroup, AvatarRoot } from '../avatar'

import { GenericAvatar } from './generic-avatar'

export function WithCustomIconAvatar() {
  return (
    <AvatarGroup>
      <AvatarRoot>
        <AvatarFallback>
          <GenericAvatar />
        </AvatarFallback>
      </AvatarRoot>
      <AvatarRoot>
        <AvatarFallback />
      </AvatarRoot>
    </AvatarGroup>
  )
}
