import { MdCheckCircle, MdSettings } from 'react-icons/md'

import { Meta, StoryFn } from '@storybook/react-vite'

import { ListIndicator, ListItem, ListRoot } from './list'

export default {
  component: ListRoot,
  title: 'Components / Data Display / List'
} as Meta<typeof ListRoot>

const Template: StoryFn<typeof ListRoot> = args => (
  <ListRoot as="ul" {...args}>
    <ListItem>Lorem ipsum dolor sit amet</ListItem>
    <ListItem>Consectetur adipiscing elit</ListItem>
    <ListItem>Integer molestie lorem at massa</ListItem>
    <ListItem>Facilisis in pretium nisl aliquet</ListItem>
  </ListRoot>
)

export const Unordered = {
  render: Template,
  args: {}
}

export const Ordered: StoryFn<typeof ListRoot> = () => (
  <ListRoot as="ol">
    <ListItem>Lorem ipsum dolor sit amet</ListItem>
    <ListItem>Consectetur adipiscing elit</ListItem>
    <ListItem>Integer molestie lorem at massa</ListItem>
    <ListItem>Facilisis in pretium nisl aliquet</ListItem>
  </ListRoot>
)

export const WithIcons: StoryFn<typeof ListRoot> = () => (
  <ListRoot gap={3}>
    <ListItem>
      <ListIndicator asChild>
        <MdCheckCircle color="var(--chakra-colors-primary-500)" />
      </ListIndicator>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit
    </ListItem>
    <ListItem>
      <ListIndicator asChild>
        <MdCheckCircle color="var(--chakra-colors-primary-500)" />
      </ListIndicator>
      Assumenda, quia temporibus eveniet a libero incidunt suscipit
    </ListItem>
    <ListItem>
      <ListIndicator asChild>
        <MdCheckCircle color="var(--chakra-colors-primary-500)" />
      </ListIndicator>
      Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
    </ListItem>
    <ListItem>
      <ListIndicator asChild>
        <MdSettings color="var(--chakra-colors-primary-500)" />
      </ListIndicator>
      Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
    </ListItem>
  </ListRoot>
)
