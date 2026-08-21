import {
  rh,
  TableColumnHeader,
  TableHeader as ChakraTableHeader,
  TableRow,
  useBreakpoint,
  VisuallyHidden
} from '@redesignhealth/ui'

const TableHeader = () => {
  const breakpoint = useBreakpoint({ ssr: false })

  return (
    <>
      {(breakpoint === 'xl' || breakpoint === '2xl') && (
        <rh.colgroup>
          <rh.col span={1} w="28%" />
          <rh.col span={1} w="20%" />
          <rh.col span={1} w="20%" />
          <rh.col span={1} w="20%" />
          <rh.col span={1} w="6%" />
          <rh.col span={1} w="6%" />
        </rh.colgroup>
      )}
      <ChakraTableHeader>
        <TableRow>
          <TableColumnHeader>Name</TableColumnHeader>
          <TableColumnHeader>User type</TableColumnHeader>
          <TableColumnHeader>Date added</TableColumnHeader>
          <TableColumnHeader>Company</TableColumnHeader>
          <TableColumnHeader>
            <VisuallyHidden>Edit User</VisuallyHidden>
          </TableColumnHeader>
          <TableColumnHeader>
            <VisuallyHidden>Impersonate User</VisuallyHidden>
          </TableColumnHeader>
        </TableRow>
      </ChakraTableHeader>
    </>
  )
}

export default TableHeader
