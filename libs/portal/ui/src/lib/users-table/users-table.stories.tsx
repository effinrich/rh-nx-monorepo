import type { Meta } from '@storybook/react-vite'

import { UsersTable } from './users-table'

const Story: Meta<typeof UsersTable> = {
  component: UsersTable,
  title: 'UsersTable'
}
export default Story

export const Default = {
  args: {}
}
