import { MdSettings } from 'react-icons/md'
import { Box } from '@chakra-ui/react'

import { AddIcon, Avatar, HStack } from '../../index'

import { Tag, TagCloseButton, TagLabel, TagLeftIcon, TagRightIcon } from './tag'

export default {
  component: Tag,
  title: 'Components / Data Display / Tag',
  argTypes: {
    variant: {
      options: ['subtle', 'solid', 'outline'],
      control: { type: 'radio' }
    },
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' }
    },
    colorPalette: {
      options: [
        'gray',
        'primary',
        'whiteAlpha',
        'blackAlpha',
        'gray',
        'red',
        'orange',
        'yellow',
        'green',
        'cyan',
        'facebook',
        'teal'
      ],
      control: { type: 'select' }
    }
  },
  decorators: [
    (story: any) => (
      <Box maxW="600px" mx="auto" mt="40px">
        {story()}
      </Box>
    )
  ]
} as Meta<typeof Tag>

export const Basic: StoryObj<typeof Tag> = {
  render: args => <Tag {...args}>Gray</Tag>
}

export const WithSizes: StoryObj<typeof Tag> = {
  render: args => (
    <HStack gap="3">
      <Tag size="sm" {...args}>
        Gray
      </Tag>
      <Tag size="md" {...args}>
        Gray
      </Tag>
      <Tag size="lg" {...args}>
        Gray
      </Tag>
    </HStack>
  )
}

export const ColorPalettes: StoryObj<typeof Tag> = {
  render: args => (
    <HStack gap="3">
      <Tag size="sm" {...args}>
        Default
      </Tag>
      <Tag size="sm" colorPalette="primary" {...args}>
        Brand (primary)
      </Tag>
      <Tag size="sm" colorPalette="green" {...args}>
        Green
      </Tag>
      <Tag size="md" colorPalette="pink" {...args}>
        Pink
      </Tag>
      <Tag size="lg" colorPalette="blue" {...args}>
        Blue
      </Tag>
    </HStack>
  )
}

export const WithLeftIcon: StoryObj<typeof Tag> = {
  render: args => (
    <Tag colorPalette="cyan" {...args}>
      <TagLeftIcon w="12px" h="12px" as={AddIcon} />
      <TagLabel>Cyan</TagLabel>
    </Tag>
  )
}

export const WithRightIcon: StoryObj<typeof Tag> = {
  render: args => (
    <HStack gap="3">
      <Tag colorPalette="cyan" {...args}>
        <TagLabel>Cyan</TagLabel>
        <TagRightIcon w="12px" h="12px" as={AddIcon} />
      </Tag>

      <Tag variant="solid" colorPalette="teal" {...args}>
        <TagLabel>Teal</TagLabel>
        <TagRightIcon as={MdSettings} />
      </Tag>
    </HStack>
  )
}

export const WithCloseButton: StoryObj<typeof Tag> = {
  render: args => (
    <HStack gap="3">
      <Tag variant="solid" size="sm" colorPalette="cyan" {...args}>
        <TagLabel>Tab Label</TagLabel>
        <TagCloseButton />
      </Tag>

      <Tag variant="solid" size="md" colorPalette="cyan" {...args}>
        <TagLabel>Tab Label</TagLabel>
        <TagCloseButton />
      </Tag>

      <Tag variant="solid" size="lg" colorPalette="cyan" {...args}>
        <TagLabel>Tab Label</TagLabel>
        <TagCloseButton />
      </Tag>
    </HStack>
  )
}

export const WithCustomElement: StoryObj<typeof Tag> = {
  render: args => (
    <Tag size="lg" colorPalette="red" borderRadius="full" {...args}>
      <Avatar
        src="https://bit.ly/dan-abramov"
        size="xs"
        name="Dan Abramov"
        marginLeft={-1}
        marginRight={2}
      />
      <TagLabel>Segun</TagLabel>
      <TagCloseButton />
    </Tag>
  )
}
