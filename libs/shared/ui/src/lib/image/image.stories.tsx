import { Meta } from '@storybook/react-vite'

import { Box, Stack } from '../../index'

import { Image, ImageProps } from './image'
import { BugImage } from './partials/bug-image'
import { FallbackElementExampleImage } from './partials/fallback-element-example-image'
import { FallbackSrcExampleImage } from './partials/fallback-src-example-image'
import { FallbackStrategiesImage } from './partials/fallback-strategies-image'
import { WithFitImage } from './partials/with-fit-image'
import { WithNativeWidthImage } from './partials/with-native-width-image'
import { WithSrcSetImage } from './partials/with-src-set-image'

const Story: Meta<typeof Image> = {
  component: Image,
  title: 'Components / Media & Icons / Image',
  args: {
    src: 'https://bit.ly/dan-abramov',
    alt: 'Dan Abramov'
  }
}
export default Story

export const Basic = {
  render: (args: ImageProps) => {
    return (
      <Box boxSize="sm">
        <Image {...args} />
      </Box>
    )
  }
}

export const FallbackSrcExample = {
  render: () => <FallbackSrcExampleImage />
}

export const FallbackElementExample = {
  render: () => <FallbackElementExampleImage />
}

export const WithFit = {
  render: () => <WithFitImage />
}

export const WithNativeWidth = {
  render: () => <WithNativeWidthImage />
}

export const Bug = {
  render: () => <BugImage />
}

export const WithSrcSet = {
  render: () => <WithSrcSetImage />
}

export const FallbackStrategies = {
  render: () => <FallbackStrategiesImage />
}

export const Size = {
  render: (args: ImageProps) => {
    return (
      <Stack direction="row">
        <Image boxSize="100px" objectFit="cover" {...args} />
        <Image boxSize="150px" objectFit="cover" {...args} />
        <Image boxSize="200px" {...args} />
      </Stack>
    )
  }
}

export const WithBorderRadius = {
  render: () => {
    return (
      <Image
        borderRadius="full"
        boxSize="150px"
        src="https://bit.ly/dan-abramov"
        alt="Dan Abramov"
      />
    )
  }
}
