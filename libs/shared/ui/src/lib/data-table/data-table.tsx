import { useState } from 'react'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable
} from '@tanstack/react-table'

import {
  rh,
  TableRoot,
  TableScrollArea,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRow,
  TriangleDownIcon,
  TriangleUpIcon
} from '../../index'

export type DataTableProps<Data extends object> = {
  data: Data[]
  columns: ColumnDef<Data, any>[]
  variant: string
  colorPalette: string
}

export function DataTable<Data extends object>({
  data,
  columns,
  variant,
  colorPalette
}: DataTableProps<Data>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting
    },
    debugTable: true
  })

  return (
    <TableScrollArea borderBottomRadius="8px">
      <TableRoot variant={variant as any} colorPalette={colorPalette}>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = header.column.columnDef.meta
                return (
                  <TableColumnHeader
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    textAlign={meta?.isNumeric ? 'end' : undefined}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}

                    <rh.span pl="4">
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'desc' ? (
                          <TriangleDownIcon aria-label="sorted descending" />
                        ) : (
                          <TriangleUpIcon aria-label="sorted ascending" />
                        )
                      ) : null}
                    </rh.span>
                  </TableColumnHeader>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => {
                // see https://tanstack.com/table/v8/docs/api/core/column-def#meta to type this correctly
                const meta: any = cell.column.columnDef.meta
                return (
                  <TableCell key={cell.id} textAlign={meta?.isNumeric ? 'end' : undefined}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </TableScrollArea>
  )
}
