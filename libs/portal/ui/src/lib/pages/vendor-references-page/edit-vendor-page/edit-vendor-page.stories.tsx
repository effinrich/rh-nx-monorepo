import { mockVendor } from '@redesignhealth/portal/data-assets'
import { getVendorCategories } from '@redesignhealth/portal/data-assets'
import { http, HttpResponse } from 'msw'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import EditVendorPage from './edit-vendor-page'

const Story: Meta<typeof EditVendorPage> = {
  component: EditVendorPage,
  title: 'Pages / Edit Vendor Page',
  decorators: [withRouter],
  args: {
    data: {
      ...mockVendor,
      categories: getVendorCategories(mockVendor)
    }
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/pDrgZWbUTfF49d6uoTK2Vi/Platform-SSOT%3A-Vendor-Info-Collection-%26-Search?type=design&node-id=816-43830&mode=dev'
    },
    msw: {
      handlers: [
        http.get(`/vendor/${mockVendor.apiId}`, () => {
          return HttpResponse.json(mockVendor)
        })
      ]
    }
  }
}
export default Story

export const Default = {
  args: {}
}
