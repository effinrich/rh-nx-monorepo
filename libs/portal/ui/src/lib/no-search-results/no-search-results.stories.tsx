import type { Meta } from '@storybook/react-vite'

import NoSearchResults from './no-search-results'

const Story: Meta<typeof NoSearchResults> = {
  component: NoSearchResults,
  title: 'Components/NoSearchResults',
  args: {
    searchName: 'call notes'
  }
}
export default Story

export const Default = {
  args: {}
}
