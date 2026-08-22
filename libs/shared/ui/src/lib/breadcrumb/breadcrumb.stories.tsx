import { Meta } from '@storybook/react-vite'

import { BreadcrumbRoot } from './breadcrumb'
import { BasicBreadcrumb } from './partials/basic-breadcrumb'
import { WithCustomSeparatorBreadcrumb } from './partials/with-custom-separator-breadcrumb'
import { WithSeparatorBreadcrumb } from './partials/with-separator-breadcrumb'

export default {
  title: 'Components / Navigation / Breadcrumb',
  component: BreadcrumbRoot
} as Meta<typeof BreadcrumbRoot>

export const Basic = {
  render: () => <BasicBreadcrumb />
}

export const WithSeparator = {
  render: () => <WithSeparatorBreadcrumb />
}

export const WithCustomSeparator = {
  render: () => <WithCustomSeparatorBreadcrumb />
}
