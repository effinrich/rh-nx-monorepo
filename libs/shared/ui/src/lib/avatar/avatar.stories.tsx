import { Stack } from '@chakra-ui/react'
import { expect, within } from 'storybook/test'

import { GenericAvatar } from './partials/generic-avatar'
import { AvatarBadge, AvatarFallback, AvatarGroup, AvatarImage, AvatarRoot } from './avatar'

export default {
  title: 'Components / Media & Icons / Avatar'
}

export const Basic = () => (
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

export const WithCustomIcon = () => (
  <AvatarGroup>
    <AvatarRoot icon={<GenericAvatar />}>
      <AvatarFallback />
    </AvatarRoot>
    <AvatarRoot>
      <AvatarFallback />
    </AvatarRoot>
  </AvatarGroup>
)

export const WithSizes = () => (
  <Stack direction="row" gap="24px">
    {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(size => (
      <AvatarRoot
        key={size}
        size={size}
        name="Uchiha Itachi"
      >
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <AvatarImage src="https://uinames.com/api/photos/female/18.jpg" />
        <AvatarFallback />
        <AvatarBadge boxSize="1.25em" bg="green.500" />
      </AvatarRoot>
    ))}
  </Stack>
)

export const WithSrcSet = () => {
  const small =
    'https://accelerated.atoms.crystallize.digital/snowball/images/PalmaSpeedJusterteBilder-15/_resized_300.jpg'
  const medium =
    'https://accelerated.atoms.crystallize.digital/snowball/images/PalmaSpeedJusterteBilder-15/_resized_768.jpg'
  const large =
    'https://accelerated.atoms.crystallize.digital/snowball/images/PalmaSpeedJusterteBilder-15/_resized_1280.jpg'
  const xlarge =
    'https://accelerated.atoms.crystallize.digital/snowball/images/PalmaSpeedJusterteBilder-15/_resized_3200.jpg'

  return (
    <AvatarRoot name="Uchiha Itachi">
      {/* @ts-expect-error Chakra v3 compound component typing */}
      <AvatarImage
        src={small}
        srcSet={`${small} 300w, ${medium} 768w, ${large} 1280w, ${xlarge} 3200w`}
      />
      <AvatarFallback />
    </AvatarRoot>
  )
}

export const AvatarsGroup = {
  render: () => (
    <AvatarGroup size="lg">
      <AvatarRoot>
        <AvatarImage src="https://bit.ly/ryan-florence" alt="Ryan Florence" />
        <AvatarFallback name="Ryan Florence" />
      </AvatarRoot>
      <AvatarRoot>
        <AvatarImage src="https://bit.ly/kent-c-dodds" alt="Kent Dodds" />
        <AvatarFallback name="Kent Dodds" />
      </AvatarRoot>
      <AvatarRoot>
        <AvatarImage src="https://bit.ly/prosper-baba" alt="Prosper Otemuyiwa" />
        <AvatarFallback name="Prosper Otemuyiwa" />
      </AvatarRoot>
      <AvatarRoot>
        <AvatarFallback>+1</AvatarFallback>
      </AvatarRoot>
    </AvatarGroup>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('+1')).toBeInTheDocument()
  }
}
