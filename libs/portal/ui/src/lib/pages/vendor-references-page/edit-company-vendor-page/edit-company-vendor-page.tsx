import { useNavigate, useParams } from 'react-router-dom'
import {
  CompanyVendorProps,
  useGetCompanyVendor,
  usePutCompanyVendor
} from '@redesignhealth/portal/data-assets'
import { Box, Loader, SectionHeader } from '@redesignhealth/ui'

import AxiosErrorAlert from '../../../axios-error-alert/axios-error-alert'
import { CompanyVendorForm } from '../company-vendor-form/company-vendor-form'
export const EditCompanyVendorPage = () => {
  const navigate = useNavigate()
  const { companyId, companyVendorId } = useParams()
  const { data: companyVendor } = useGetCompanyVendor(
    companyId,
    companyVendorId
  )
  const { mutateAsync, error, isError, isPending } = usePutCompanyVendor(
    companyId as string,
    companyVendorId as string
  )

  if (!companyVendor) {
    return <Loader />
  }

  return (
    <Box>
      <SectionHeader
        title="Edit company vendor"
        helpText="Tell us a little about the vendor."
        isDivider={false}
        pb={6}
      />

      {isError && <AxiosErrorAlert error={error?.response?.data} mb={5} />}
      <CompanyVendorForm
        onSubmit={async (formData: CompanyVendorProps) => {
          await mutateAsync(formData)
          navigate(`/companies/${companyId}/vendors`)
        }}
        submitText="Save"
        onCancel={() => navigate(`/companies/${companyId}/vendors`)}
        isPending={isPending}
        isEdit={true}
        defaultValues={companyVendor}
      />
    </Box>
  )
}

export default EditCompanyVendorPage
