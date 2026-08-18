import { testA11y } from '@redesignhealth/shared-utils-jest'

import {
  TableBody,
  TableCaption,
  TableCell,
  TableColumnHeader,
  TableFooter,
  TableHeader,
  TableRoot,
  TableRow
} from './table'

describe('<Table />', () => {
  it('should pass a11y test', async () => {
    const simpleTable = (
      <TableRoot>
        <TableCaption>Imperial to metric conversion factors</TableCaption>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>To convert</TableColumnHeader>
            <TableColumnHeader>into</TableColumnHeader>
            <TableColumnHeader textAlign="end">multiply by</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>inches</TableCell>
            <TableCell>millimetres (mm)</TableCell>
            <TableCell textAlign="end">25.4</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableColumnHeader>To convert</TableColumnHeader>
            <TableColumnHeader>into</TableColumnHeader>
            <TableColumnHeader textAlign="end">multiply by</TableColumnHeader>
          </TableRow>
        </TableFooter>
      </TableRoot>
    )

    await testA11y(simpleTable)
  })
})
