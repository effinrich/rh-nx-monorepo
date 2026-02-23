import { createColumnHelper } from '@tanstack/react-table'

import type { Meta } from '@storybook/react-vite'

import { DataTable } from './data-table'

type UnitConversion = {
  fromUnit: string
  toUnit: string
  factor: number
}

const data: UnitConversion[] = [
  {
    fromUnit: 'inches',
    toUnit: 'millimetres (mm)',
    factor: 25.4
  },
  {
    fromUnit: 'feet',
    toUnit: 'centimetres (cm)',
    factor: 30.48
  },
  {
    fromUnit: 'yards',
    toUnit: 'metres (m)',
    factor: 0.91444
  }
]

const columnHelper = createColumnHelper<UnitConversion>()

const columns: any = [
  columnHelper.accessor('fromUnit', {
    cell: info => info.getValue(),
    header: 'To convert'
  }),
  columnHelper.accessor('toUnit', {
    cell: info => info.getValue(),
    header: 'Into'
  }),
  columnHelper.accessor('factor', {
    cell: info => info.getValue(),
    header: 'Multiply by',
    meta: {
      isNumeric: true
    }
  })
]

const Story: Meta<typeof DataTable> = {
  component: DataTable,
  title: 'Components / Data Display / Data Table / Sorting',
  args: {
    columns,
    data,
    variant: 'striped',
    colorPalette: 'primary'
  }
}
export default Story

export const Default = {
  args: {}
}
