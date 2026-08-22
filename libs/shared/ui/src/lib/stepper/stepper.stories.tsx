import { Meta } from '@storybook/react-vite'

import { HorizontalStepper } from './partials/horizontal-stepper'
import { VerticalStepper } from './partials/vertical-stepper'
import { StepsRoot } from './stepper'

export default {
  component: StepsRoot,
  title: 'Components / Navigation / Stepper'
} as Meta<typeof StepsRoot>

export const Horizontal = {
  render: () => <HorizontalStepper />
}

export const Vertical = {
  render: () => <VerticalStepper />
}
