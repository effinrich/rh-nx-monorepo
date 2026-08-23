import { Stack } from '@chakra-ui/react'

import { AvatarBadge, AvatarFallback, AvatarImage, AvatarRoot } from '../avatar'

export function WithSizesAvatar() {
  return (
    <Stack direction="row" gap="24px">
      {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(size => (
        <AvatarRoot key={size} size={size}>
          {/* @ts-expect-error Chakra v3 compound component typing */}
          <AvatarImage src="https://uinames.com/api/photos/female/18.jpg" />
          <AvatarFallback name="Uchiha Itachi" />
          <AvatarBadge boxSize="1.25em" bg="green.500" />
        </AvatarRoot>
      ))}
    </Stack>
  )
}
