import { Stack } from '@chakra-ui/react'

import { AvatarFallback, AvatarImage, AvatarRoot } from '../avatar'

export function BasicAvatar() {
  return (
    <Stack direction="row">
      <AvatarRoot name="Dan Abrahmov">
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AvatarImage src="https://bit.ly/dan-abramov" />
        <AvatarFallback />
      </AvatarRoot>
      <AvatarRoot name="Christian Nwamba">
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AvatarImage src="https://bit.ly/code-beast" />
        <AvatarFallback />
      </AvatarRoot>
      <AvatarRoot name="Segun Adebayo">
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AvatarImage src="https://bit.ly/sage-adebayo" />
        <AvatarFallback />
      </AvatarRoot>
    </Stack>
  )
}
