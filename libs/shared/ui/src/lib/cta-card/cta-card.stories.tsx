import { MdExpandMore } from 'react-icons/md'

import { Meta, StoryObj } from '@storybook/react'

import {
  AddOpCoIcon,
  AddUserIcon,
  Box,
  Button,
  CheckCircleIcon,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '../../index'

import { CtaCard } from './cta-card'

export default {
  component: CtaCard,
  title: 'Patterns / Data Display / CTA Card',
  args: {
    title: 'Set up services, answer questionnaires, and assign users',
    ctaText: 'Add OpCo',
    ctaVariant: 'solid',
    ctaColorScheme: 'primary'
  },
  argTypes: {
    onClick: { action: 'clicked' },
    ctaVariant: {
      options: ['solid', 'outline', 'ghost', 'link'],
      control: { type: 'radio' }
    },
    ctaColorScheme: {
      options: [
        'primary',
        'gray',
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
  parameters: {
    controls: {
      include: [
        'title',
        'ctaText',
        'ctaVariant',
        'ctaColorScheme',
        'helpText',
        'bgColor',
        'headingcolor'
      ]
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3TjPei1XxNoAItGhumZyxg/Platform-Portal---Design-SSOT?node-id=1799%3A37304&t=REeBl3wkGFUSIkta-4'
    }
  },
  decorators: [
    (Story: any) => (
      <Box mx="auto" maxW="2xl" mt="40px">
        {Story()}
      </Box>
    )
  ]
} as Meta<typeof CtaCard>

export const Default: StoryObj<typeof CtaCard> = {
  render: args => (
    <CtaCard
      icon={AddOpCoIcon}
      onClick={args.onClick}
      boxShadow="none"
      borderWidth="none"
      {...args}
    />
  )
}

export const WithHelpText: StoryObj<typeof CtaCard> = {
  render: args => (
    <CtaCard
      icon={AddUserIcon}
      onClick={args.onClick}
      boxShadow="none"
      borderWidth="none"
      helpText="Some extra copy to help the user"
      {...args}
    />
  )
}

export const WithNoIcon: StoryObj<typeof CtaCard> = {
  render: args => (
    <CtaCard
      onClick={args.onClick}
      boxShadow="none"
      borderWidth="none"
      {...args}
    />
  )
}

export const WithBorder: StoryObj<typeof CtaCard> = {
  render: args => (
    <CtaCard
      icon={CheckCircleIcon}
      onClick={args.onClick}
      boxShadow="none"
      borderWidth={1}
      {...args}
    />
  )
}

export const WithBoxShadow: StoryObj<typeof CtaCard> = {
  render: args => (
    <CtaCard
      icon={CheckCircleIcon}
      onClick={args.onClick}
      boxShadow="sm"
      borderWidth="none"
      {...args}
    />
  )
}

export const WithBorderAndBoxShadow: StoryObj<typeof CtaCard> = {
  render: args => (
    <CtaCard
      icon={CheckCircleIcon}
      onClick={args.onClick}
      boxShadow="sm"
      borderWidth={1}
      {...args}
    />
  )
}

export const WithCustonCta: StoryObj<typeof CtaCard> = {
  render: args => (
    <CtaCard
      icon={CheckCircleIcon}
      ctaButton={
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<Icon as={MdExpandMore} />}
            colorScheme={args.ctaColorScheme}
          >
            Custom CTA
          </MenuButton>
          <MenuList>
            <MenuItem>Option 1</MenuItem>
            <MenuItem>Option 2</MenuItem>
          </MenuList>
        </Menu>
      }
      boxShadow="sm"
      borderWidth={1}
      {...args}
    />
  )
}
