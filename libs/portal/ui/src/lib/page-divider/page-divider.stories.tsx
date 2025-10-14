import type { Meta } from '@storybook/react-vite'

import PageDivider from './page-divider'

const Story: Meta<typeof PageDivider> = {
  component: PageDivider,
  title: 'Components / Page Divider',
  args: {
    content: 'Divider text'
  },
  argTypes: {
    content: { type: 'string' }
  }
}
export default Story

export const Default = {
  args: {}
}
