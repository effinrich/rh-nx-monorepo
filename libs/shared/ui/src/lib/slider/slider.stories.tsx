import * as React from 'react'

import { Meta } from '@storybook/react-vite'

import { rh } from '../rh/rh'

import { HorizontalSlider as HorizontalSliderExample } from './partials/horizontal-slider'
import { RhHorizontalSlider } from './partials/rh-horizontal-slider'
import { SteppedHorizontalSlider as SteppedHorizontalSliderExample } from './partials/stepped-horizontal-slider'
import { VerticalSlider as VerticalSliderExample } from './partials/vertical-slider'
import { WithPropsUpdateSlider } from './partials/with-props-update-slider'
import { SliderRoot } from './slider'

export default {
  component: SliderRoot,
  title: 'Components / Forms / Slider',
  decorators: [
    (story: () => React.ReactNode) => (
      <rh.div maxWidth="400px" height="300px" mx="auto" mt="40px">
        {story()}
      </rh.div>
    )
  ]
} as Meta<typeof SliderRoot>

export const WithPropsUpdate = {
  render: () => <WithPropsUpdateSlider />
}

export const HorizontalSlider = {
  render: () => <HorizontalSliderExample />
}

export const VerticalSlider = {
  render: () => <VerticalSliderExample />
}

export const rhHorizontalSlider = {
  render: () => <RhHorizontalSlider />
}

export const SteppedHorizontalSlider = {
  render: () => <SteppedHorizontalSliderExample />
}
