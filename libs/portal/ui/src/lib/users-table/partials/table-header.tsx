import {
  rh,
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
        <rh.colgroup>
          <rh.col span={1} w="28%" />
          <rh.col span={1} w="20%" />
          <rh.col span={1} w="20%" />
          <rh.col span={1} w="20%" />
          <rh.col span={1} w="6%" />
          <rh.col span={1} w="6%" />
        </rh.colgroup>
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
