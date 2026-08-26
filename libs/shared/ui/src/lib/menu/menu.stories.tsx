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

import {
  MenuRoot,
  MenuTrigger,
  MenuSeparator,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuItem,
  MenuContent,
  MenuPositioner
} from './menu'

const Story: Meta<typeof MenuRoot> = {
  component: MenuRoot,
  title: 'Overlay/Menu',
  args: {}
}
export default Story

export const Default = {
  render: (args: any) => (
    <MenuRoot {...args}>
      <MenuTrigger asChild>
        <Button>
          Actions
          <ChevronDownIcon />
        </Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem value="download">Download</MenuItem>
          <MenuItem value="copy">Create a Copy</MenuItem>
          <MenuItem value="draft">Mark as Draft</MenuItem>
          <MenuItem value="delete">Delete</MenuItem>
          <MenuItem value="workshop">Attend a Workshop</MenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  )
}

export const LetterNavigation = {
  render: (args: any) => (
    <MenuRoot {...args}>
      <MenuTrigger asChild>
        <Button px={4} py={2} borderRadius="md" borderWidth="1px">
          File <ChevronDownIcon />
        </Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem value="new-file">New File</MenuItem>
          <MenuItem value="new-window">New Window</MenuItem>
          <MenuSeparator />
          <MenuItem value="open">Open...</MenuItem>
          <MenuItem value="save">Save File</MenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  )
}

export const WithImages = {
  render: (args: any) => (
    <MenuRoot {...args}>
      <MenuTrigger asChild>
        <Button>
          Your Cats
          <ChevronDownIcon />
        </Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem value="fluffybuns" minH="48px">
            <Image
              boxSize="2rem"
              borderRadius="full"
              src="https://placekitten.com/100/100"
              alt="Fluffybuns the destroyer"
              mr="12px"
            />
            <span>Fluffybuns the Destroyer</span>
          </MenuItem>
          <MenuItem value="simon" minH="40px">
            <Image
              boxSize="2rem"
              borderRadius="full"
              src="https://placekitten.com/120/120"
              alt="Simon the pensive"
              mr="12px"
            />
            <span>Simon the pensive</span>
          </MenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  )
}

export const WithIconsAndCommands = {
  render: (args: any) => (
    <MenuRoot {...args}>
      <MenuTrigger asChild>
        <IconButton aria-label="Options" variant="outline">
          <HamburgerIcon />
        </IconButton>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem value="new-tab">
            <AddIcon />
            New Tab
          </MenuItem>
          <MenuItem value="new-window">
            <ExternalLinkIcon />
            New Window
          </MenuItem>
          <MenuItem value="open-closed">
            <RepeatIcon />
            Open Closed Tab
          </MenuItem>
          <MenuItem value="open-file">
            <EditIcon />
            Open File...
          </MenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  )
}

export const LazyMounting = {
  render: (args: any) => (
    <MenuRoot {...args}>
      <MenuTrigger asChild>
        <Button>Open menu</Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem value="new-window">New Window</MenuItem>
          <MenuItem value="open-closed">Open Closed Tab</MenuItem>
          <MenuItem value="open-file">Open File</MenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  )
}

export const WithMenuGroup = {
  render: (args: any) => (
    <MenuRoot {...args}>
      <MenuTrigger asChild>
        <Button colorPalette="pink">Profile</Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItemGroup>
            <MenuItemGroupLabel>Profile</MenuItemGroupLabel>
            <MenuItem value="account">My Account</MenuItem>
            <MenuItem value="payments">Payments</MenuItem>
          </MenuItemGroup>
          <MenuSeparator />
          <MenuItemGroup>
            <MenuItemGroupLabel>Help</MenuItemGroupLabel>
            <MenuItem value="docs">Docs</MenuItem>
            <MenuItem value="faq">FAQ</MenuItem>
          </MenuItemGroup>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  )
}

export const MenuItemAsALink = {
  render: (args: any) => (
    <MenuRoot {...args}>
      <MenuTrigger asChild>
        <Button>Open menu</Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent>
          <MenuItem value="link1" asChild>
            <a href="#">Link 1</a>
          </MenuItem>
          <MenuItem value="link2" asChild>
            <a href="#">Link 2</a>
          </MenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  )
}

export const MenuOptionGroups = {
  render: (args: any) => (
    <MenuRoot closeOnSelect={false} {...args}>
      <MenuTrigger asChild>
        <Button colorPalette="blue">MenuItem</Button>
      </MenuTrigger>
      <MenuPositioner>
        <MenuContent minWidth="240px">
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
          <MenuSeparator />
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="phone">Phone</MenuItem>
          <MenuItem value="country">Country</MenuItem>
        </MenuContent>
      </MenuPositioner>
    </MenuRoot>
  )
}
