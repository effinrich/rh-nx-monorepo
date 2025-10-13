import { FormProvider, useForm } from 'react-hook-form'

import type { Meta } from '@storybook/react'

import { VendorForm } from './vendor-form'

const Story: Meta<typeof VendorForm> = {
  component: VendorForm,
  title: 'components/Forms/Vendor',
  decorators: [
    Story => (
      <FormProvider {...useForm()}>
        <Story />
      </FormProvider>
    )
  ],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/pDrgZWbUTfF49d6uoTK2Vi/Platform-SSOT%3A-Vendor-Info-Collection-%26-Search?type=design&node-id=816-43632&mode=design&t=yx9KWpq4RLnTl2FF-4'
    }
  }
}
export default Story

export const Default = {}

export const WithError = {
  args: {
    error: { error: { response: { data: { message: 'Error message' } } } }
  }
}
