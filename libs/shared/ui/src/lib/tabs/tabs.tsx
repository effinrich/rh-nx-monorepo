// Chakra UI v3: Tabs uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

import { Box, BoxProps } from '@chakra-ui/react'
import {
  TabsRoot as _TabsRoot,
  TabsList as _TabsList,
  TabsTrigger as _TabsTrigger,
  TabsContent as _TabsContent,
  TabsIndicator as _TabsIndicator
} from '@chakra-ui/react'

// In Chakra v3, `Tabs` is a namespace object (not a component).
// Export TabsRoot as Tabs for backward compat.
export { TabsRoot as Tabs } from '@chakra-ui/react'

/* eslint-disable @typescript-eslint/no-explicit-any */
// Export Tabs compound components (v3 recommended pattern)
export const TabsRoot = _TabsRoot
export const TabsList = _TabsList as any
export const TabsTrigger = _TabsTrigger as any
export const TabsContent = _TabsContent as any
export const TabsIndicator = _TabsIndicator

// Re-export with v2 names for backward compatibility during migration
export const Tab = _TabsTrigger as any
export const TabList = _TabsList as any
export const TabPanel = _TabsContent as any
export const TabIndicator = _TabsIndicator
export const TabsContainer = _TabsRoot
/* eslint-enable @typescript-eslint/no-explicit-any */

// v2 TabPanels backward compatibility wrapper
// In v3, TabPanels is no longer needed - content goes directly in Tabs.Root
// This is a simple pass-through for migration purposes
export const TabPanels = (props: BoxProps) => <Box {...props} />
