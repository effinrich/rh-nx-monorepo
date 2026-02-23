// Chakra UI v3: Breadcrumb uses compound component pattern
// See: https://chakra-ui.com/docs/get-started/migration

// In Chakra v3, `Breadcrumb` is a namespace object (not a component).
// Export BreadcrumbRoot as Breadcrumb for backward compat with v2.
export { BreadcrumbRoot as Breadcrumb } from '@chakra-ui/react'

// Export Breadcrumb compound components (v3 recommended pattern)
export {
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbCurrentLink,
  BreadcrumbEllipsis
} from '@chakra-ui/react'

// Export types
export type { BreadcrumbRootProps, BreadcrumbLinkProps } from '@chakra-ui/react'
