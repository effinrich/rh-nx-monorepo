import { Meta } from '@storybook/react-vite'

import { SimpleTable } from './partials/simple-table'
import { TableRoot, TableScrollArea } from './table'

export default {
  component: TableRoot,
  title: 'Components / Data Display / Table / Simple'
} as Meta<typeof TableRoot>

export const SimpleSM = {
  render: () => <SimpleTable size="sm" />
}

export const SimpleMD = {
  render: () => <SimpleTable size="md" />
}

export const SimpleLG = {
  render: () => <SimpleTable size="lg" />
}

export const StripedSM = {
  render: () => <SimpleTable striped size="sm" />
}

export const StripedMD = {
  render: () => <SimpleTable striped size="md" />
}

export const StripedLG = {
  render: () => <SimpleTable striped size="lg" />
}

export const Unstyled = {
  render: () => <SimpleTable unstyled />
}

export const WithOverflow = {
  render: () => (
    <TableScrollArea maxW={{ base: '400px', lg: 'unset' }}>
      <SimpleTable />
    </TableScrollArea>
  )
}
