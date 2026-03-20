// Chakra UI v3: Menu uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

export { Menu } from '@chakra-ui/react'

// Export Menu compound components (v3 recommended pattern)
// Using 'as any' for components with strict children/asChild typing issues
import {
  MenuRoot as _MenuRoot,
  MenuTrigger as _MenuTrigger,
  MenuContent as _MenuContent,
  MenuItem as _MenuItem,
  MenuItemGroup as _MenuItemGroup,
  MenuItemGroupLabel as _MenuItemGroupLabel,
  MenuSeparator as _MenuSeparator,
  MenuPositioner as _MenuPositioner,
  MenuArrow as _MenuArrow,
  MenuArrowTip as _MenuArrowTip,
  MenuCheckboxItem as _MenuCheckboxItem,
  MenuRadioItem as _MenuRadioItem,
  MenuRadioItemGroup as _MenuRadioItemGroup,
  MenuContextTrigger as _MenuContextTrigger,
  MenuItemText as _MenuItemText,
  MenuItemCommand as _MenuItemCommand,
  MenuTriggerItem as _MenuTriggerItem
} from '@chakra-ui/react'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const MenuRoot = _MenuRoot
export const MenuTrigger = _MenuTrigger as any
export const MenuContent = _MenuContent as any
export const MenuItem = _MenuItem as any
export const MenuItemGroup = _MenuItemGroup as any
export const MenuItemGroupLabel = _MenuItemGroupLabel as any
export const MenuSeparator = _MenuSeparator
export const MenuPositioner = _MenuPositioner as any
export const MenuArrow = _MenuArrow
export const MenuArrowTip = _MenuArrowTip
export const MenuCheckboxItem = _MenuCheckboxItem as any
export const MenuRadioItem = _MenuRadioItem as any
export const MenuRadioItemGroup = _MenuRadioItemGroup as any
export const MenuContextTrigger = _MenuContextTrigger as any
export const MenuItemText = _MenuItemText as any
export const MenuItemCommand = _MenuItemCommand as any
export const MenuTriggerItem = _MenuTriggerItem as any
/* eslint-enable @typescript-eslint/no-explicit-any */

// Re-export with v2 names for backward compatibility during migration
export {
  MenuTrigger as MenuButton,
  MenuContent as MenuList,
  MenuSeparator as MenuDivider,
  MenuItemGroup as MenuGroup,
  MenuRadioItemGroup as MenuOptionGroup,
  MenuRadioItem as MenuItemOption
}
