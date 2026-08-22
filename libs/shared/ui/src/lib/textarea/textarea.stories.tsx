import { Meta } from '@storybook/react-vite'

import { Container } from '../../index'

import { BasicTextarea } from './partials/basic-textarea'
import { WithControlledTextarea } from './partials/with-controlled-textarea'
import { WithFieldTextarea } from './partials/with-field-textarea'
import { WithFocusAndErrorColorsTextarea } from './partials/with-focus-and-error-colors-textarea'
import { WithResizeTextarea } from './partials/with-resize-textarea'
import { WithSizesTextarea } from './partials/with-sizes-textarea'
import { WithStatesTextarea } from './partials/with-states-textarea'
import { WithVariantsTextarea } from './partials/with-variants-textarea'
import { Textarea } from './textarea'

export default {
  component: Textarea,
  title: 'Components / Forms / Textarea',
  decorators: [
    (Story: () => unknown) => (
      <Container>
        <Story />
      </Container>
    )
  ]
} as Meta<typeof Textarea>

export const Basic = {
  render: () => <BasicTextarea />
}

export const WithControlled = {
  render: () => <WithControlledTextarea />
}

export const WithResize = {
  render: () => <WithResizeTextarea />
}

export const WithSizes = {
  render: () => <WithSizesTextarea />
}

export const WithStates = {
  render: () => <WithStatesTextarea />
}

export const WithVariants = {
  render: () => <WithVariantsTextarea />
}

export const WithFocusAndErrorColors = {
  render: () => <WithFocusAndErrorColorsTextarea />
}

export const WithField = {
  render: () => <WithFieldTextarea />
}
