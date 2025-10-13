import { useNavigate } from 'react-router-dom'
import {
  useCreateVendor,
  VendorFormProps
} from '@redesignhealth/portal/data-assets'
import { Box, SectionHeader } from '@redesignhealth/ui'

import { VendorForm } from '../vendor-form/vendor-form'

export const AddVendorPage = () => {
  const navigate = useNavigate()

  const { mutateAsync: createVendor, error, isPending } = useCreateVendor()

  const handleOnSubmit = async (formData: VendorFormProps) => {
    await createVendor(formData)
    navigate('/vendors')
  }

  return (
    <Box>
      <SectionHeader
        title="New vendor"
        helpText="Tell us a little about the vendor."
        isDivider={false}
        pb={6}
        isSticky
      />
      <VendorForm
        onSubmit={handleOnSubmit}
        submitText="Add vendor"
        onCancel={() => navigate('/vendors')}
        isPending={isPending}
        error={error}
      />
    </Box>
  )
}

export default AddVendorPage
