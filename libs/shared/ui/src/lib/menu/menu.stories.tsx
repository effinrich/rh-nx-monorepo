import type { Meta } from '@storybook/react'

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

import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup
} from './menu'

const Story: Meta<typeof Menu> = {
  component: Menu,
  title: 'Overlay/Menu',
  args: {}
}
export default Story

export const Default = {
  render: (args: any) => (
    <Menu {...args}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem>Download</MenuItem>
        <MenuItem>Create a Copy</MenuItem>
        <MenuItem>Mark as Draft</MenuItem>
        <MenuItem>Delete</MenuItem>
        <MenuItem>Attend a Workshop</MenuItem>
      </MenuList>
    </Menu>
  )
}

export const LetterNavigation = {
  render: (args: any) => (
    <Menu {...args}>
      <MenuButton
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
      </MenuButton>
      <MenuList>
        <MenuItem>New File</MenuItem>
        <MenuItem>New Window</MenuItem>
        <MenuDivider />
        <MenuItem>Open...</MenuItem>
        <MenuItem>Save File</MenuItem>
      </MenuList>
    </Menu>
  )
}

export const WithImages = {
  render: (args: any) => (
    <Menu {...args}>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        Your Cats
      </MenuButton>
      <MenuList>
        <MenuItem minH="48px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src="https://placekitten.com/100/100"
            alt="Fluffybuns the destroyer"
            mr="12px"
          />
          <span>Fluffybuns the Destroyer</span>
        </MenuItem>
        <MenuItem minH="40px">
          <Image
            boxSize="2rem"
            borderRadius="full"
            src="https://placekitten.com/120/120"
            alt="Simon the pensive"
            mr="12px"
          />
          <span>Simon the pensive</span>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export const WithIconsAndCommands = {
  render: (args: any) => (
    <Menu {...args}>
      <MenuButton
        as={IconButton}
        aria-label="Options"
        icon={<HamburgerIcon />}
        variant="outline"
      />
      <MenuList>
        <MenuItem icon={<AddIcon />} command="⌘T">
          New Tab
        </MenuItem>
        <MenuItem icon={<ExternalLinkIcon />} command="⌘N">
          New Window
        </MenuItem>
        <MenuItem icon={<RepeatIcon />} command="⌘⇧N">
          Open Closed Tab
        </MenuItem>
        <MenuItem icon={<EditIcon />} command="⌘O">
          Open File...
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export const LazyMounting = {
  render: (args: any) => (
    <Menu isLazy {...args}>
      <MenuButton>Open menu</MenuButton>
      <MenuList>
        {/* MenuItems are not rendered unless Menu is open */}
        <MenuItem>New Window</MenuItem>
        <MenuItem>Open Closed Tab</MenuItem>
        <MenuItem>Open File</MenuItem>
      </MenuList>
    </Menu>
  )
}

export const WithMenuGroup = {
  render: (args: any) => (
    <Menu {...args}>
      <MenuButton as={Button} colorScheme="pink">
        Profile
      </MenuButton>
      <MenuList>
        <MenuGroup title="Profile">
          <MenuItem>My Account</MenuItem>
          <MenuItem>Payments </MenuItem>
        </MenuGroup>
        <MenuDivider />
        <MenuGroup title="Help">
          <MenuItem>Docs</MenuItem>
          <MenuItem>FAQ</MenuItem>
        </MenuGroup>
      </MenuList>
    </Menu>
  )
}

export const MenuItemAsALink = {
  render: (args: any) => (
    <Menu {...args}>
      <MenuButton>Open menu</MenuButton>
      <MenuList>
        <MenuItem as="a" href="#">
          Link 1
        </MenuItem>
        <MenuItem as="a" href="#">
          Link 2
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export const MenuOptionGroups = {
  render: (args: any) => (
    <Menu closeOnSelect={false} {...args}>
      <MenuButton as={Button} colorScheme="blue">
        MenuItem
      </MenuButton>
      <MenuList minWidth="240px">
        <MenuOptionGroup defaultValue="asc" title="Order" type="radio">
          <MenuItemOption value="asc">Ascending</MenuItemOption>
          <MenuItemOption value="desc">Descending</MenuItemOption>
        </MenuOptionGroup>
        <MenuDivider />
        <MenuOptionGroup title="Country" type="checkbox">
          <MenuItemOption value="email">Email</MenuItemOption>
          <MenuItemOption value="phone">Phone</MenuItemOption>
          <MenuItemOption value="country">Country</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  )
}
