import {
  Box,
  Th,
  Thead,
  Tr,
  useBreakpoint,
  VisuallyHidden
} from '@redesignhealth/ui'

const TableHeader = () => {
  const breakpoint = useBreakpoint({ ssr: false })

  return (
    <>
      {(breakpoint === 'xl' || breakpoint === '2xl') && (
        <Box as="colgroup">
          <Box as="col" span={1} w="28%" />
          <Box as="col" span={1} w="20%" />
          <Box as="col" span={1} w="20%" />
          <Box as="col" span={1} w="20%" />
          <Box as="col" span={1} w="6%" />
          <Box as="col" span={1} w="6%" />
        </Box>
      )}
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>User type</Th>
          <Th>Date added</Th>
          <Th>Company</Th>
          <Th>
            <VisuallyHidden>Edit User</VisuallyHidden>
          </Th>
          <Th>
            <VisuallyHidden>Impersonate User</VisuallyHidden>
          </Th>
        </Tr>
      </Thead>
    </>
  )
}

export default TableHeader
