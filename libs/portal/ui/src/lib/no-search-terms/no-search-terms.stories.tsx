import type { Meta } from '@storybook/react-vite'

import NoSearchTerms from './no-search-terms'

const Story: Meta<typeof NoSearchTerms> = {
  component: NoSearchTerms,
  title: 'Components/NoSearchTerms'
}
export default Story

export const Default = {
  args: {}
}
