import { FormProvider, useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import {
  type VendorsProps,
  useGetUserInfo,
  useGetVendors
} from '@redesignhealth/portal/data-assets'
import { HasRole } from '@redesignhealth/portal/utils'
import { Box, Button, Loader, SectionHeader } from '@redesignhealth/ui'

import VendorFilterBox from './vendor-references-filter-box/vendor-references-filter-box'
import { VendorReferencesCardsWrapper } from './vendor-references-cards-wrapper'

export const VendorReferencesPage = () => {
  const { watch, ...formMethods } = useForm<VendorsProps>({
    defaultValues: {
      query: '',
      categoryFilter: undefined,
      subcategoryFilter: undefined
    }
  })

  const { data: vendorsData } = useGetVendors(watch())

  const { data: userInfo } = useGetUserInfo()
  const currentRole = userInfo?.role?.authority
  const userCompany = userInfo?.memberOf?.[0]
  return (
    <Box as="section" w="full">
      <SectionHeader
        pb={6}
        title="Vendor References"
        isDivider={false}
        rightElement={
          <>
            <HasRole currentRole={currentRole} allowed={['ROLE_SUPER_ADMIN']}>
              <Button as={Link} colorScheme="primary" to="/vendors/add-vendor">
                Add vendor
              </Button>
            </HasRole>
            <HasRole currentRole={currentRole} allowed={['ROLE_OP_CO_USER']}>
              <Button
                as={Link}
                colorScheme="primary"
                to={`/companies/${userCompany?.id}/vendors/add`}
              >
                Add vendor
              </Button>
            </HasRole>
          </>
        }
      />
      <FormProvider {...formMethods} watch={watch}>
        <VendorFilterBox />
      </FormProvider>

      {vendorsData ? (
        <VendorReferencesCardsWrapper vendors={vendorsData} />
      ) : (
        <Loader />
      )}
    </Box>
  )
}

export default VendorReferencesPage
