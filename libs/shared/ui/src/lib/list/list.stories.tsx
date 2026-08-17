import { MdCheckCircle, MdSettings } from 'react-icons/md'

import { Meta, StoryFn } from '@storybook/react-vite'

import { ListRoot, ListIcon, ListItem, OrderedList, UnorderedList } from './list'

export default {
  component: ListRoot,
  title: 'Components / Data Display / List'
} as Meta<typeof ListRoot>

const Template: StoryFn<typeof ListRoot> = args => (
  <UnorderedList {...args}>
    <ListItem>Lorem ipsum dolor sit amet</ListItem>
    <ListItem>Consectetur adipiscing elit</ListItem>
    <ListItem>Integer molestie lorem at massa</ListItem>
    <ListItem>Facilisis in pretium nisl aliquet</ListItem>
  </UnorderedList>
)

export const Unordered = {
  render: Template,
  args: {}
}

export const Ordered: StoryFn<typeof ListRoot> = () => (
  <OrderedList>
    <ListItem>Lorem ipsum dolor sit amet</ListItem>
    <ListItem>Consectetur adipiscing elit</ListItem>
    <ListItem>Integer molestie lorem at massa</ListItem>
    <ListItem>Facilisis in pretium nisl aliquet</ListItem>
  </OrderedList>
)

export const WithIcons: StoryFn<typeof ListRoot> = () => (
  <ListRoot gap={3}>
    <ListItem>
      <ListIcon as={MdCheckCircle} color="primary.500" />
      Lorem ipsum dolor sit amet, consectetur adipisicing elit
    </ListItem>
    <ListItem>
      <ListIcon as={MdCheckCircle} color="primary.500" />
      Assumenda, quia temporibus eveniet a libero incidunt suscipit
    </ListItem>
    <ListItem>
      <ListIcon as={MdCheckCircle} color="primary.500" />
      Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
    </ListItem>
    {/* You can also use custom icons from react-icons */}
    <ListItem>
      <ListIcon as={MdSettings} color="primary.500" />
      Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
    </ListItem>
  </ListRoot>
)
