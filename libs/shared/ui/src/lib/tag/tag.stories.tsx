import { MdSettings } from 'react-icons/md'
import { chakra } from '@chakra-ui/react'

import {
  AddIcon,
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
  HStack
} from '../../index'

import {
  TagRoot,
  TagCloseTrigger,
  TagLabel,
  TagStartElement,
  TagEndElement
} from './tag'

export default {
  component: TagRoot,
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
      <chakra.div maxW="600px" mx="auto" mt="40px">
        {story()}
      </chakra.div>
    )
  ]
}

export const Basic = {
  render: (args: any) => (
    <TagRoot {...args}>
      <TagLabel>Gray</TagLabel>
    </TagRoot>
  )
}

export const WithSizes = {
  render: (args: any) => (
    <HStack gap="3">
      <TagRoot size="sm" {...args}>
        <TagLabel>Gray</TagLabel>
      </TagRoot>
      <TagRoot size="md" {...args}>
        <TagLabel>Gray</TagLabel>
      </TagRoot>
      <TagRoot size="lg" {...args}>
        <TagLabel>Gray</TagLabel>
      </TagRoot>
    </HStack>
  )
}

export const ColorSchemes = {
  render: (args: any) => (
    <HStack gap="3">
      <TagRoot size="sm" {...args}>
        <TagLabel>Default</TagLabel>
      </TagRoot>
      <TagRoot size="sm" colorPalette="primary" {...args}>
        <TagLabel>Brand (primary)</TagLabel>
      </TagRoot>
      <TagRoot size="sm" colorPalette="green" {...args}>
        <TagLabel>Green</TagLabel>
      </TagRoot>
      <TagRoot size="md" colorPalette="pink" {...args}>
        <TagLabel>Pink</TagLabel>
      </TagRoot>
      <TagRoot size="lg" colorPalette="blue" {...args}>
        <TagLabel>Blue</TagLabel>
      </TagRoot>
    </HStack>
  )
}

export const WithLeftIcon = {
  render: (args: any) => (
    <TagRoot colorPalette="cyan" {...args}>
      <TagStartElement>
        <AddIcon w="12px" h="12px" />
      </TagStartElement>
      <TagLabel>Cyan</TagLabel>
    </TagRoot>
  )
}

export const WithRightIcon = {
  render: (args: any) => (
    <HStack gap="3">
      <TagRoot colorPalette="cyan" {...args}>
        <TagLabel>Cyan</TagLabel>
        <TagEndElement>
          <AddIcon w="12px" h="12px" />
        </TagEndElement>
      </TagRoot>

      <TagRoot variant="solid" colorPalette="teal" {...args}>
        <TagLabel>Teal</TagLabel>
        <TagEndElement>
          <MdSettings />
        </TagEndElement>
      </TagRoot>
    </HStack>
  )
}

export const WithCloseButton = {
  render: (args: any) => (
    <HStack gap="3">
      <TagRoot variant="solid" size="sm" colorPalette="cyan" {...args}>
        <TagLabel>Tab Label</TagLabel>
        <TagCloseTrigger />
      </TagRoot>

      <TagRoot variant="solid" size="md" colorPalette="cyan" {...args}>
        <TagLabel>Tab Label</TagLabel>
        <TagCloseTrigger />
      </TagRoot>

      <TagRoot variant="solid" size="lg" colorPalette="cyan" {...args}>
        <TagLabel>Tab Label</TagLabel>
        <TagCloseTrigger />
      </TagRoot>
    </HStack>
  )
}

export const WithCustomElement = {
  render: (args: any) => (
    <TagRoot size="lg" colorPalette="red" borderRadius="full" {...args}>
      <AvatarRoot size="xs" marginLeft={-1} marginRight={2}>
        <AvatarImage src="https://bit.ly/dan-abramov" alt="Dan Abramov" />
        <AvatarFallback name="Dan Abramov" />
      </AvatarRoot>
      <TagLabel>Segun</TagLabel>
      <TagCloseTrigger />
    </TagRoot>
  )
}
