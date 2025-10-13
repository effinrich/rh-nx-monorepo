import { MdSettings } from 'react-icons/md'
import { chakra } from '@chakra-ui/system'

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
    colorScheme: {
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
      <chakra.div maxW="600px" mx="auto" mt="40px">
        {story()}
      </chakra.div>
    )
  ]
}

export const Basic = {
  render: (args: any) => <Tag {...args}>Gray</Tag>
}

export const WithSizes = {
  render: (args: any) => (
    <HStack spacing="3">
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

export const ColorSchemes = {
  render: (args: any) => (
    <HStack spacing="3">
      <Tag size="sm" {...args}>
        Default
      </Tag>
      <Tag size="sm" colorScheme="primary" {...args}>
        Brand (primary)
      </Tag>
      <Tag size="sm" colorScheme="green" {...args}>
        Green
      </Tag>
      <Tag size="md" colorScheme="pink" {...args}>
        Pink
      </Tag>
      <Tag size="lg" colorScheme="blue" {...args}>
        Blue
      </Tag>
    </HStack>
  )
}

export const WithLeftIcon = {
  render: (args: any) => (
    <Tag colorScheme="cyan" {...args}>
      <TagLeftIcon w="12px" h="12px" as={AddIcon} />
      <TagLabel>Cyan</TagLabel>
    </Tag>
  )
}

export const WithRightIcon = {
  render: (args: any) => (
    <HStack spacing="3">
      <Tag colorScheme="cyan" {...args}>
        <TagLabel>Cyan</TagLabel>
        <TagRightIcon w="12px" h="12px" as={AddIcon} />
      </Tag>

      <Tag variant="solid" colorScheme="teal" {...args}>
        <TagLabel>Teal</TagLabel>
        <TagRightIcon as={MdSettings} />
      </Tag>
    </HStack>
  )
}

export const WithCloseButton = {
  render: (args: any) => (
    <HStack spacing="3">
      <Tag variant="solid" size="sm" colorScheme="cyan" {...args}>
        <TagLabel>Tab Label</TagLabel>
        <TagCloseButton />
      </Tag>

      <Tag variant="solid" size="md" colorScheme="cyan" {...args}>
        <TagLabel>Tab Label</TagLabel>
        <TagCloseButton />
      </Tag>

      <Tag variant="solid" size="lg" colorScheme="cyan" {...args}>
        <TagLabel>Tab Label</TagLabel>
        <TagCloseButton />
      </Tag>
    </HStack>
  )
}

export const WithCustomElement = {
  render: (args: any) => (
    <Tag size="lg" colorScheme="red" borderRadius="full" {...args}>
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
