import { VendorFormProps } from '@redesignhealth/portal/data-assets'
import { withRouter } from 'storybook-addon-react-router-v6'

import { action } from '@storybook/addon-actions'
import type { Meta } from '@storybook/react'

import AddVendorPage from './add-vendor-page'

const Story: Meta<typeof AddVendorPage> = {
  title: 'Pages / Add Vendor Page',
  component: AddVendorPage,
  args: {},
  argTypes: {},
  decorators: [withRouter],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/pDrgZWbUTfF49d6uoTK2Vi/Platform-SSOT%3A-Vendor-Info-Collection-%26-Search?type=design&node-id=816-43632&mode=design&t=yx9KWpq4RLnTl2FF-4'
    }
  }
}

const MockCreateVendor = {
  mutateAsync: async (data: VendorFormProps) => {
    action('createVendor')(data)
    return Promise.resolve()
  },
  error: null,
  isError: false,
  isPending: false
}

export default Story

export const Default = {
  args: {
    useCreateVendor: () => MockCreateVendor,
    useNavigate: () => action('navigate')
  }
}

export const PendingState = {
  args: {
    ...Default.args,
    useCreateVendor: () => ({
      ...MockCreateVendor,
      isPending: true
    })
  }
}
