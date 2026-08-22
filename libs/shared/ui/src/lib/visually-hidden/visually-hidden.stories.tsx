import { Meta } from '@storybook/react-vite'

import { HiddenInput as HiddenInputExample } from './partials/hidden-input'
import { HiddenSpan as HiddenSpanExample } from './partials/hidden-span'
import { VisuallyHidden } from './visually-hidden'

export default {
  component: VisuallyHidden,
  title: 'Components / Disclosure / Visually Hidden'
} as Meta<typeof VisuallyHidden>

export const HiddenSpan = {
  render: () => <HiddenSpanExample />
}

export const HiddenInput = {
  render: () => <HiddenInputExample />
}
