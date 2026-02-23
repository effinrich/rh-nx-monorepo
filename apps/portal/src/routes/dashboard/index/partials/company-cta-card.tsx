import { AddCompanyButton } from '@redesignhealth/portal/features/companies'
import { AddOpCoIcon as AddCompanyIcon, CtaCard } from '@redesignhealth/ui'

interface CompanyCtaCardProps {
  companiesExist?: boolean
  isCurrentUserAdmin?: boolean
}
const CompanyCtaCard = ({
  companiesExist,
  isCurrentUserAdmin
}: CompanyCtaCardProps) => {
  if (companiesExist) {
    const commonProps = {
      variant: 'filled',
      title: 'Set up services, answer questionnaires, and assign users',
      icon: AddCompanyIcon,
      'data-testid': 'companies-cta'
    }
    if (isCurrentUserAdmin) {
      return <CtaCard {...commonProps} ctaButton={<AddCompanyButton />} />
    }
    return (
      <CtaCard {...commonProps} ctaText="View my companies" to="/companies" />
    )
  }
  return (
    <CtaCard
      variant="filled"
      icon={AddCompanyIcon}
      headingWeight="bold"
      title="No companies assigned yet"
      hasButtonAction={false}
      ctaTextAlternative="Contact your admin to get access to your companies"
      data-testid="no-companies-cta"
    />
  )
}

export default CompanyCtaCard
