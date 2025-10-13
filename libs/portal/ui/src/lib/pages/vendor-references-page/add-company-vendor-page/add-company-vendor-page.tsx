import { useNavigate, useParams } from 'react-router-dom'
import {
  CompanyVendorProps,
  usePostCompanyVendor
} from '@redesignhealth/portal/data-assets'
import { Box, SectionHeader } from '@redesignhealth/ui'

import AxiosErrorAlert from '../../../axios-error-alert/axios-error-alert'
import { CompanyVendorForm } from '../company-vendor-form/company-vendor-form'

export const AddCompanyVendorPage = () => {
  const navigate = useNavigate()
  const { companyId } = useParams()
  const {
    mutateAsync: createVendor,
    error,
    isError,
    isPending
  } = usePostCompanyVendor(companyId as string)

  return (
    <Box>
      <SectionHeader
        title="New vendor information"
        helpText="Tell us a little about the vendor."
        isDivider={false}
        pb={6}
      />

      {isError && <AxiosErrorAlert error={error?.response?.data} mb={5} />}
      <CompanyVendorForm
        onSubmit={async (data: CompanyVendorProps) => {
          await createVendor(data)
          navigate(`/companies/${companyId}/vendors`)
        }}
        submitText="Add vendor"
        onCancel={() => navigate(`/companies/${companyId}/vendors`)}
        isPending={isPending}
      />
    </Box>
  )
}

export default AddCompanyVendorPage
