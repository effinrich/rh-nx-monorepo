import { Menu } from '@chakra-ui/react'

import type { Meta } from '@storybook/react-vite'

import { Button } from '../button/button'
import { IconButton } from '../icon-button/icon-button'
import {
  AddIcon,
  ChevronDownIcon,
  EditIcon,
  ExternalLinkIcon,
  HamburgerIcon,
  RepeatIcon
} from '../icons/icons'
import { Image } from '../image/image'

const Story: Meta<typeof Menu> = {
  component: Menu,
  title: 'Overlay/Menu',
  args: {}
}
export default Story

export const Default = {
  render: (args: any) => (
    <Menu.Root {...args}>
      <Menu.Trigger asChild>
        <Button rightIcon={<ChevronDownIcon />}>Actions</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item value="download">Download</Menu.Item>
        <Menu.Item value="copy">Create a Copy</Menu.Item>
        <Menu.Item value="draft">Mark as Draft</Menu.Item>
        <Menu.Item value="delete">Delete</Menu.Item>
        <Menu.Item value="attend">Attend a Workshop</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  )
}

export const LetterNavigation = {
  render: (args: any) => (
    <Menu.Root {...args}>
      <Menu.Trigger asChild>
        <Button
          px={4}
          py={2}
          transition="all 0.2s"
          borderRadius="md"
          borderWidth="1px"
          _hover={{ bg: 'gray.400' }}
          _expanded={{ bg: 'blue.400' }}
          _focus={{ boxShadow: 'outline' }}
        >
          File <ChevronDownIcon />
        </Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item value="new-file">New File</Menu.Item>
        <Menu.Item value="new-window">New Window</Menu.Item>
        <Menu.Separator />
        <Menu.Item value="open">Open...</Menu.Item>
        <Menu.Item value="save">Save File</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  )
}

export const WithImages = {
  render: (args: any) => (
    <Menu.Root {...args}>
      <Menu.Trigger asChild>
        <Button rightIcon={<ChevronDownIcon />}>Your Cats</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item value="fluffy" minH="48px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src="https://placekitten.com/100/100"
            alt="Fluffybuns the destroyer"
            mr="12px"
          />
          <span>Fluffybuns the Destroyer</span>
        </Menu.Item>
        <Menu.Item value="simon" minH="40px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src="https://placekitten.com/120/120"
            alt="Simon the pensive"
            mr="12px"
          />
          <span>Simon the pensive</span>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  )
}

export const WithIconsAndCommands = {
  render: (args: any) => (
    <Menu.Root {...args}>
      <Menu.Trigger asChild>
        <IconButton
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item value="new-tab">
          <AddIcon />
          New Tab
          <Menu.ItemCommand>⌘T</Menu.ItemCommand>
        </Menu.Item>
        <Menu.Item value="new-window">
          <ExternalLinkIcon />
          New Window
          <Menu.ItemCommand>⌘N</Menu.ItemCommand>
        </Menu.Item>
        <Menu.Item value="open-closed">
          <RepeatIcon />
          Open Closed Tab
          <Menu.ItemCommand>⌘⇧N</Menu.ItemCommand>
        </Menu.Item>
        <Menu.Item value="open-file">
          <EditIcon />
          Open File...
          <Menu.ItemCommand>⌘O</Menu.ItemCommand>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  )
}

export const LazyMounting = {
  render: (args: any) => (
    <Menu.Root lazyMount {...args}>
      <Menu.Trigger asChild>
        <Button>Open menu</Button>
      </Menu.Trigger>
      <Menu.Content>
        {/* MenuItems are not rendered unless Menu is open */}
        <Menu.Item value="new-window">New Window</Menu.Item>
        <Menu.Item value="open-closed">Open Closed Tab</Menu.Item>
        <Menu.Item value="open-file">Open File</Menu.Item>
      </Menu.Content>
    </Menu.Root>
  )
}

export const WithMenuGroup = {
  render: (args: any) => (
    <Menu.Root {...args}>
      <Menu.Trigger asChild>
        <Button colorPalette="pink">Profile</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.ItemGroup>
          <Menu.ItemGroupLabel>Profile</Menu.ItemGroupLabel>
          <Menu.Item value="account">My Account</Menu.Item>
          <Menu.Item value="payments">Payments </Menu.Item>
        </Menu.ItemGroup>
        <Menu.Separator />
        <Menu.ItemGroup>
          <Menu.ItemGroupLabel>Help</Menu.ItemGroupLabel>
          <Menu.Item value="docs">Docs</Menu.Item>
          <Menu.Item value="faq">FAQ</Menu.Item>
        </Menu.ItemGroup>
      </Menu.Content>
    </Menu.Root>
  )
}

export const MenuItemAsALink = {
  render: (args: any) => (
    <Menu.Root {...args}>
      <Menu.Trigger asChild>
        <Button>Open menu</Button>
      </Menu.Trigger>
      <Menu.Content>
        <Menu.Item value="link1" asChild>
          <a href="#">Link 1</a>
        </Menu.Item>
        <Menu.Item value="link2" asChild>
          <a href="#">Link 2</a>
        </Menu.Item>
      </Menu.Content>
    </Menu.Root>
  )
}

export const MenuOptionGroups = {
  render: (args: any) => (
    <Menu.Root closeOnSelect={false} {...args}>
      <Menu.Trigger asChild>
        <Button colorPalette="blue">MenuItem</Button>
      </Menu.Trigger>
      <Menu.Content minWidth="240px">
        <Menu.RadioItemGroup defaultValue="asc">
          <Menu.ItemGroupLabel>Order</Menu.ItemGroupLabel>
          <Menu.RadioItem value="asc">Ascending</Menu.RadioItem>
          <Menu.RadioItem value="desc">Descending</Menu.RadioItem>
        </Menu.RadioItemGroup>
        <Menu.Separator />
        <Menu.CheckboxItemGroup defaultValue={['email', 'phone']}>
          <Menu.ItemGroupLabel>Country</Menu.ItemGroupLabel>
          <Menu.CheckboxItem value="email">Email</Menu.CheckboxItem>
          <Menu.CheckboxItem value="phone">Phone</Menu.CheckboxItem>
          <Menu.CheckboxItem value="country">Country</Menu.CheckboxItem>
        </Menu.CheckboxItemGroup>
      </Menu.Content>
    </Menu.Root>
  )
}
