// Chakra UI v3: Tabs uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

import { Box, BoxProps } from '@chakra-ui/react'

// In Chakra v3, `Tabs` is a namespace object (not a component).
// Export TabsRoot as Tabs for backward compat.
export { TabsRoot as Tabs } from '@chakra-ui/react'

// Export Tabs compound components (v3 recommended pattern)
export {
  TabsRoot,
  TabsList,
  TabsTrigger,
  TabsContent,
  TabsIndicator
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility during migration
// These are deprecated - use Tabs.* components instead
export {
  TabsTrigger as Tab,
  TabsList as TabList,
  TabsContent as TabPanel,
  TabsIndicator as TabIndicator,
  TabsRoot as TabsContainer
} from '@chakra-ui/react'

// v2 TabPanels backward compatibility wrapper
// In v3, TabPanels is no longer needed - content goes directly in Tabs.Root
// This is a simple pass-through for migration purposes
export const TabPanels = (props: BoxProps) => <Box {...props} />
