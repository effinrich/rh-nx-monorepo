import { Helmet } from 'react-helmet'
import { useNavigate, useParams } from 'react-router-dom'
import {
  convertCompanyToCommand,
  useGetCompanyById,
  useUpdateCompany
} from '@redesignhealth/portal/data-assets'
import {
  BackButton,
  MarketplaceCompanyForm,
  Page
} from '@redesignhealth/portal/ui'
import { Loader, SectionHeader } from '@redesignhealth/ui'

const EditMarketplaceCompany = () => {
  const { companyId } = useParams()
  const { data: company } = useGetCompanyById(companyId)
  const { mutateAsync: updateCompany } = useUpdateCompany(companyId)
  const navigate = useNavigate()
  const backNavigation = `/companies/${companyId}`
  return (
    <Page>
      {company && (
        <Helmet>
          <title>Marketplace Company | Edit | {company.name}</title>
        </Helmet>
      )}
      <BackButton to={backNavigation}>Back to company</BackButton>
      <SectionHeader
        title="Edit marketplace company"
        helpText="Update the company information below."
        isDivider={false}
        mb={6}
        mt={6}
      />
      {company ? (
        <MarketplaceCompanyForm
          isEdit
          defaultValues={convertCompanyToCommand(company)}
          onSubmit={async data => {
            await updateCompany(data)
            navigate(backNavigation)
          }}
          onCancel={() => navigate(backNavigation)}
        />
      ) : (
        <Loader />
      )}
    </Page>
  )
}

export default EditMarketplaceCompany
