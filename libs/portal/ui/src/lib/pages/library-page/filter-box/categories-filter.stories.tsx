import type { Meta } from '@storybook/react'

import { CategoriesFilter } from './categories-filter'

const Story: Meta<typeof CategoriesFilter> = {
  component: CategoriesFilter,
  title: 'Components/CategoriesFilter'
}
export default Story

export const Default = {
  args: {}
}
