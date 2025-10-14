import { mockVendor } from '@redesignhealth/portal/data-assets'
import { getVendorCategories } from '@redesignhealth/portal/data-assets'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import VendorDetailsPage from './vendor-details-page'

const Story: Meta<typeof VendorDetailsPage> = {
  component: VendorDetailsPage,
  title: 'pages/ Vendor Details Page',
  decorators: [withRouter],
  args: {
    data: {
      ...mockVendor,
      categories: getVendorCategories(mockVendor)
    }
  }
}
export default Story

export const Default = {}
