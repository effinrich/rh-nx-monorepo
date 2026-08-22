import { Meta } from '@storybook/react-vite'

import { Box } from '../../index'

import { AsContainerSkeleton } from './partials/as-container-skeleton'
import { BasicSkeleton } from './partials/basic-skeleton'
import { CircleSkeleton } from './partials/circle-skeleton'
import { CombinedSkeleton } from './partials/combined-skeleton'
import { TextLinesSkeleton } from './partials/text-lines-skeleton'
import { WithCustomSpeedSkeleton } from './partials/with-custom-speed-skeleton'
import { WithDarkModeSkeleton } from './partials/with-dark-mode-skeleton'
import { WithFadeAlreadyLoadedSkeleton } from './partials/with-fade-already-loaded-skeleton'
import { WithFadeSkeleton } from './partials/with-fade-skeleton'
import { WithFadeTextSkeleton } from './partials/with-fade-text-skeleton'
import { WithFitContentSkeleton } from './partials/with-fit-content-skeleton'
import { WithIsLoadedSkeleton } from './partials/with-is-loaded-skeleton'
import { WithNoFadeSkeleton } from './partials/with-no-fade-skeleton'
import { WithStartAndEndColorSkeleton } from './partials/with-start-and-end-color-skeleton'
import { Skeleton } from './skeleton'

export default {
  component: Skeleton,
  title: 'Components / Feedback / Skeleton',
  decorators: [
    (story: () => unknown) => (
      <Box mx="auto" maxW="900px" w="full" mt={24}>
        {story()}
      </Box>
    )
  ]
} as Meta<typeof Skeleton>

export const Basic = {
  render: () => <BasicSkeleton />
}

export const TextLines = {
  render: () => <TextLinesSkeleton />
}

export const AsContainer = {
  render: () => <AsContainerSkeleton />
}

export const WithFitContent = {
  render: () => <WithFitContentSkeleton />
}

export const WithFade = {
  render: () => <WithFadeSkeleton />
}

export const WithFadeText = {
  render: () => <WithFadeTextSkeleton />
}

export const WithFadeAlreadyLoaded = {
  render: () => <WithFadeAlreadyLoadedSkeleton />
}

export const WithNoFade = {
  render: () => <WithNoFadeSkeleton />
}

export const Circle = {
  render: () => <CircleSkeleton />
}

export const Combined = {
  render: () => <CombinedSkeleton />
}

export const WithIsLoaded = {
  render: () => <WithIsLoadedSkeleton />
}

export const WithCustomSpeed = {
  render: () => <WithCustomSpeedSkeleton />
}

export const WithDarkMode = {
  render: () => <WithDarkModeSkeleton />
}

export const WithStartAndEndColor = {
  render: () => <WithStartAndEndColorSkeleton />
}
