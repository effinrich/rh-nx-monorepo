import { Meta } from '@storybook/react-vite'

import { ListRoot } from './list'
import { OrderedList } from './partials/ordered-list'
import { UnorderedListTemplate } from './partials/unordered-list-template'
import { WithIconsList } from './partials/with-icons-list'

export default {
  component: ListRoot,
  title: 'Components / Data Display / List'
} as Meta<typeof ListRoot>

export const Unordered = {
  render: (args: Record<string, unknown>) => (
    <UnorderedListTemplate {...args} />
  ),
  args: {}
}

export const Ordered = {
  render: () => <OrderedList />
}

export const WithIcons = {
  render: () => <WithIconsList />
}
