import {
  type TableRootProps,
  TableBody,
  TableCaption,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRoot,
  TableRow
} from '../table'

export function SimpleTable(props: TableRootProps) {
  return (
    <TableRoot {...props}>
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
        <TableRow>
          <TableCell>feet</TableCell>
          <TableCell>centimetres (cm)</TableCell>
          <TableCell textAlign="end">30.48</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>yards</TableCell>
          <TableCell>metres (m)</TableCell>
          <TableCell textAlign="end">0.91444</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>miles</TableCell>
          <TableCell>kilometres (km)</TableCell>
          <TableCell textAlign="end">1.61</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>square inches</TableCell>
          <TableCell>sq. millimetres (mm²)</TableCell>
          <TableCell textAlign="end">645</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>square feet</TableCell>
          <TableCell>square metres (m²)</TableCell>
          <TableCell textAlign="end">0.0929</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>square yards</TableCell>
          <TableCell>square metres (m²)</TableCell>
          <TableCell textAlign="end">0.836</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>acres</TableCell>
          <TableCell>hectares</TableCell>
          <TableCell textAlign="end">2.47</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>cubic inches</TableCell>
          <TableCell>millilitres (ml)</TableCell>
          <TableCell textAlign="end">16.4</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>cubic feet</TableCell>
          <TableCell>litres</TableCell>
          <TableCell textAlign="end">28.3</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>imperial gallons</TableCell>
          <TableCell>litres</TableCell>
          <TableCell textAlign="end">4.55</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <abbr>US</abbr> barrels
          </TableCell>
          <TableCell>cubic metres (m³)</TableCell>
          <TableCell textAlign="end">0.159</TableCell>
        </TableRow>
      </TableBody>
    </TableRoot>
  )
}
