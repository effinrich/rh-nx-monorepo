// Chakra UI v3: Menu uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { Menu, Portal } from '@chakra-ui/react'

// Export Menu compound components (v3 recommended pattern)
export {
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuItemGroupLabel,
  MenuSeparator,
  MenuPositioner,
  MenuArrow,
  MenuArrowTip,
  MenuCheckboxItem,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuContextTrigger,
  MenuItemText,
  MenuItemCommand,
  MenuTriggerItem
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility during migration
// These are deprecated - use Menu.* components instead
export {
  MenuTrigger as MenuButton,
  MenuContent as MenuList,
  MenuSeparator as MenuDivider,
  MenuItemGroup as MenuGroup,
  MenuRadioItemGroup as MenuOptionGroup,
  MenuRadioItem as MenuItemOption
} from '@chakra-ui/react'
