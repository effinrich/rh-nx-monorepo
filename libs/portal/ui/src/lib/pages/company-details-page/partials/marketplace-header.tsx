import { MdEdit } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { useGetUserInfo } from '@redesignhealth/portal/data-assets'
import { HasRole } from '@redesignhealth/portal/utils'
import { Icon, IconButton, Loader, SectionHeader } from '@redesignhealth/ui'
interface MarketplaceHeaderProps {
  companyName: string
  activityType?: string
}
const MarketplaceHeader = ({
  companyName,
  activityType
}: MarketplaceHeaderProps) => {
  const { data: currentUser } = useGetUserInfo()
  return (
    <SectionHeader
      title={companyName}
      helpText={activityType}
      rightElement={
        currentUser ? (
          <HasRole
            currentRole={currentUser.role?.authority}
            allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN']}
          >
            <IconButton
              variant="outline"
              aria-label="Edit company"
              icon={<Icon as={MdEdit} />}
              as={RouterLink}
              to="edit-marketplace-company"
            />
          </HasRole>
        ) : (
          <Loader />
        )
      }
      isDivider={false}
    />
  )
}

export default MarketplaceHeader
