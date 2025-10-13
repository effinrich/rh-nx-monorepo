/* eslint-disable @typescript-eslint/no-explicit-any */
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react'

import { viewAll } from './mocks/view-all'
import { VendorReferencesPage } from './vendor-references-page'

const docs = viewAll.content

const Story: Meta<typeof VendorReferencesPage> = {
  component: VendorReferencesPage,
  title: 'pages/VendorReferencesPage',
  decorators: [withRouter],
  args: {
    vendors: docs as any
  }
}
export default Story

export const Default = {}
