import { Helmet } from 'react-helmet'
import { useParams } from 'react-router-dom'
import { useGetCompanyById } from '@redesignhealth/portal/data-assets'
import { CompanyDetailsPage, Page } from '@redesignhealth/portal/ui'

const CompanyDetails = () => {
  const { companyId } = useParams()
  const { data: company } = useGetCompanyById(companyId)
  return (
    <Page>
      {company && (
        <Helmet>
          <title>{company.name} Details</title>
        </Helmet>
      )}
      <CompanyDetailsPage />
    </Page>
  )
}

export default CompanyDetails
