import { Stack } from '@chakra-ui/react'

import { AvatarFallback, AvatarImage, AvatarRoot } from '../avatar'

export function BasicAvatar() {
  return (
    <Stack direction="row">
      <AvatarRoot>
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AvatarImage src="https://bit.ly/dan-abramov" />
        <AvatarFallback name="Dan Abrahmov" />
      </AvatarRoot>
      <AvatarRoot>
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AvatarImage src="https://bit.ly/code-beast" />
        <AvatarFallback name="Christian Nwamba" />
      </AvatarRoot>
      <AvatarRoot>
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AvatarImage src="https://bit.ly/sage-adebayo" />
        <AvatarFallback name="Segun Adebayo" />
      </AvatarRoot>
    </Stack>
  )
}
