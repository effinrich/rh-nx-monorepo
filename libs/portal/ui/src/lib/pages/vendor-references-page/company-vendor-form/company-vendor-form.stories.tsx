import { FormProvider, useForm } from 'react-hook-form'

import type { Meta } from '@storybook/react-vite'

import { CompanyVendorForm } from './company-vendor-form'

const Story: Meta<typeof CompanyVendorForm> = {
  component: CompanyVendorForm,
  title: 'components/Forms/Company Vendor',
  decorators: [
    Story => (
      <FormProvider {...useForm()}>
        <Story />
      </FormProvider>
    )
  ]
}
export default Story

export const Default = {}
