import { useNavigate } from 'react-router-dom'
import { useUpdateVendorById, Vendor } from '@redesignhealth/portal/data-assets'
import { Box, SectionHeader } from '@redesignhealth/ui'

import AxiosErrorAlert from '../../../axios-error-alert/axios-error-alert'
import { VendorForm } from '../vendor-form/vendor-form'

interface EditVendorPageProps {
  data: Vendor
}

export const EditVendorPage = ({ data }: EditVendorPageProps) => {
  const { apiId } = data
  const formFriendlyVendor = {
    ...data,
    vendorType: data.vendorType?.value || '',
    vendorPointContact: data.vendorPointContact || ''
  }
  const {
    mutateAsync: updateVendorById,
    error,
    isError,
    isPending
  } = useUpdateVendorById()

  const navigate = useNavigate()

  return (
    <Box>
      <SectionHeader
        title="Edit vendor"
        helpText="Update the vendor information below."
        isDivider={false}
        pb={6}
        isSticky
      />

      <Box>
        {isError && <AxiosErrorAlert error={error?.response?.data} mb={5} />}
        <VendorForm
          onSubmit={async formData => {
            await updateVendorById({ id: apiId, vendor: formData })
            navigate('/vendors')
          }}
          onCancel={() => navigate('/vendors')}
          isPending={isPending}
          isEdit={true}
          defaultValues={formFriendlyVendor}
        />
      </Box>
    </Box>
  )
}

export default EditVendorPage
