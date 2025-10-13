import { useGetUserInfo } from '@redesignhealth/portal/data-assets'
import { HasRole, isAdminRole } from '@redesignhealth/portal/utils'
import { Box, Flex, Text } from '@redesignhealth/ui'

import AddCompanyButton from '../../add-company-button/add-company-button'

import NoItemsBannerGraphic from './no-items-banner-graphic'

export const NoItemsBanner = () => {
  const { data: currentUser } = useGetUserInfo()
  const isCurrentUserAdmin = isAdminRole(currentUser?.role?.authority)
  return (
    <Box px="32px" pt={{ base: '80px', xl: '172px' }} pb="40px" as="main">
      <Box mx="auto" w="fit-content">
        <Flex flexDir="column" justify="center">
          <NoItemsBannerGraphic />
          <Text
            as="h1"
            mt="20px"
            fontWeight="medium"
            fontSize="18px"
            lineHeight="28px"
            textAlign="center"
          >
            {isCurrentUserAdmin
              ? 'No Companies yet'
              : 'No Companies assigned yet'}
          </Text>
          <Text
            as="p"
            mt="8px"
            fontWeight="normal"
            fontSize="14px"
            lineHeight="20px"
            textAlign="center"
            color="gray.500"
          >
            {isCurrentUserAdmin
              ? `You haven't added any operating companies.`
              : 'Contact your admin to get access to your companies'}
          </Text>

          <HasRole
            allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN']}
            currentRole={currentUser?.role?.authority}
          >
            <AddCompanyButton />
          </HasRole>
        </Flex>
      </Box>
    </Box>
  )
}
