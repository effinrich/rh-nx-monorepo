// Chakra UI v3: Table uses compound component pattern
// TableContainer → Table.ScrollArea, Td → Table.Cell, Th → Table.ColumnHeader
// isNumeric → textAlign='end'
// See: https://chakra-ui.com/docs/get-started/migration

export { Table } from '@chakra-ui/react'

// Export Table compound components (v3 recommended pattern)
export {
  TableRoot,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableCell,
  TableColumnHeader,
  TableCaption,
  TableScrollArea
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
export {
  TableScrollArea as TableContainer,
  TableHeader as Thead,
  TableBody as Tbody,
  TableFooter as Tfoot,
  TableRow as Tr,
  TableCell as Td,
  TableColumnHeader as Th
} from '@chakra-ui/react'

// Export types
export type { TableRootProps, TableRowProps, TableCellProps } from '@chakra-ui/react'
