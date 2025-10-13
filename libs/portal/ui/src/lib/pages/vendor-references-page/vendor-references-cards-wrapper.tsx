import { Link } from 'react-router-dom'
import { useGetUserInfo, Vendor } from '@redesignhealth/portal/data-assets'
import { HasRole } from '@redesignhealth/portal/utils'
import { Button, Stack } from '@redesignhealth/ui'

import { NoSearchResults } from '../../no-search-results/no-search-results'

import VendorCard from './vendor-card/vendor-card'

interface VendorReferencesCardsWrapperProps {
  vendors: Vendor[]
}
export const VendorReferencesCardsWrapper = ({
  vendors
}: VendorReferencesCardsWrapperProps) => {
  const { data: userInfo } = useGetUserInfo()

  // if (!vendors) return null

  return vendors.length > 0 ? (
    <Stack spacing="6">
      {vendors.map(vendor => {
        return (
          <VendorCard
            key={vendor.apiId}
            name={vendor.name}
            type={vendor.vendorType?.displayName}
            categories={vendor.categories?.map(c => c.name) || []}
            tags={vendor.subcategories.map(s => s.name)}
            contacts={vendor.contacts}
            title={vendor.name}
            id={vendor.apiId}
            rightAddon={
              <HasRole
                currentRole={userInfo?.role?.authority}
                allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_RH_USER']}
              >
                <Button as={Link} colorScheme="primary" to={vendor.apiId}>
                  More details
                </Button>
              </HasRole>
            }
          />
        )
      })}
    </Stack>
  ) : (
    <NoSearchResults searchName="vendor" />
  )
}

export default VendorReferencesCardsWrapper
