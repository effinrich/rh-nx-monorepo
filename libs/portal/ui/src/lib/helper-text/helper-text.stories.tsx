import type { Meta } from '@storybook/react-vite'

import { HelperText } from './helper-text'

const Story: Meta<typeof HelperText> = {
  component: HelperText,
  title: 'HelperText'
}
export default Story

export const Default = {
  args: {}
}
