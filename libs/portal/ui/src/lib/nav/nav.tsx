import {
  MdCode,
  MdCorporateFare,
  MdHomeFilled,
  MdLogout,
  MdMenuBook,
  MdOutlineFormatListBulleted,
  MdPeople,
  MdScience,
  MdScubaDiving,
  MdStore,
  MdSupport,
  MdWidgets
} from 'react-icons/md'
import { useLocation, useNavigate } from 'react-router-dom'
import type { UserInfoSummary } from '@redesignhealth/portal/data-assets'
import {
  getCompanyMemberRole,
  HasRole,
  hasRoleMatch,
  logout,
  printPersonName
} from '@redesignhealth/portal/utils'
import {
  Avatar,
  Box,
  Divider,
  Flex,
  Icon,
  IconButton,
  RedesignLogo,
  Stack,
  Text
} from '@redesignhealth/ui'
import { useQueryClient } from '@tanstack/react-query'

import MyRequestsNavButton from './partials/my-requests-nav-button'
import { NavButton } from './nav-button'

export interface NavProps {
  userInfo: UserInfoSummary
  userCompanyId?: string
  onClose?: () => void
}

export const Nav = ({ userInfo, userCompanyId, onClose }: NavProps) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    queryClient.clear()
    logout(() => {
      navigate('/sign-in', { state: { from: location }, replace: true })
    })
  }

  if (!userInfo) return null

  const currentRole = userInfo?.role?.authority
  const currentCompanyMemberRole = getCompanyMemberRole(userInfo.memberOf)
  const isEnterpriseBuyer = currentCompanyMemberRole === 'MARKETPLACE_BUYER'
  const isEnterpriseSeller = currentCompanyMemberRole === 'MARKETPLACE_SELLER'
  const isPortalProd = import.meta.env.VITE_PORTAL_ENV === 'prod'

  return (
    <Flex
      w={['auto', 'auto', 'auto', '280px']}
      h="100%"
      flexDir="column"
      justify="space-between"
      py={6}
      px={4}
      borderRight="2px"
      borderColor="transparent"
      bg="galaxy.500"
      data-testid="sidenav"
      role="navigation"
    >
      <Stack gap={4}>
        <RedesignLogo w="214px" color="white" alt="Redesign Health logo" />
        <Stack gap={1}>
          {!isEnterpriseBuyer && !isEnterpriseSeller && (
            <HasRole currentRole={currentRole} allowed={['ROLE_OP_CO_USER']}>
              <NavButton
                to={`/companies/${userCompanyId}/overview`}
                icon={MdCorporateFare}
                onClick={onClose}
              >
                My Company
              </NavButton>
            </HasRole>
          )}
          <HasRole
            currentRole={currentRole}
            allowed={['ROLE_SUPER_ADMIN', 'ROLE_RH_ADMIN', 'ROLE_RH_USER']}
          >
            <>
              <NavButton to="/" icon={MdHomeFilled} onClick={onClose}>
                Home
              </NavButton>
              <NavButton
                to="/companies"
                icon={MdCorporateFare}
                onClick={onClose}
              >
                Companies
              </NavButton>
            </>
          </HasRole>
          <HasRole
            currentRole={currentRole}
            allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN']}
          >
            <NavButton to="/users" icon={MdPeople} onClick={onClose}>
              Users
            </NavButton>
          </HasRole>
          {!isEnterpriseBuyer && !isEnterpriseSeller && (
            <NavButton to="/library" icon={MdMenuBook} onClick={onClose}>
              Library
            </NavButton>
          )}
          <HasRole
            currentRole={currentRole}
            allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_RH_USER']}
          >
            <NavButton to="/research-hub" icon={MdScience} onClick={onClose}>
              Research Hub
            </NavButton>
          </HasRole>

          {!isEnterpriseBuyer && !isEnterpriseSeller && (
            <HasRole
              currentRole={currentRole}
              allowed={
                isPortalProd
                  ? ['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_RH_USER']
                  : [
                      'ROLE_RH_ADMIN',
                      'ROLE_SUPER_ADMIN',
                      'ROLE_RH_USER',
                      'ROLE_OP_CO_USER'
                    ]
              }
            >
              <NavButton to="/vendors" icon={MdStore} onClick={onClose}>
                Vendor References
              </NavButton>
            </HasRole>
          )}
          {!isEnterpriseBuyer && !isEnterpriseSeller && (
            <HasRole
              currentRole={currentRole}
              allowed={[
                'ROLE_SUPER_ADMIN',
                'ROLE_RH_ADMIN',
                'ROLE_RH_USER',
                'ROLE_OP_CO_USER'
              ]}
            >
              <NavButton
                to="/ceo-directory"
                icon={MdOutlineFormatListBulleted}
                onClick={onClose}
              >
                CEO Directory
              </NavButton>
            </HasRole>
          )}
          {(isEnterpriseBuyer ||
            hasRoleMatch(
              ['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN'],
              currentRole
            )) && (
            <NavButton to="/ip-marketplace" icon={MdWidgets} onClick={onClose}>
              IP Marketplace
            </NavButton>
          )}
          {isEnterpriseSeller && (
            <NavButton to="/ip-listings" icon={MdWidgets} onClick={onClose}>
              IP Listings
            </NavButton>
          )}
          {(isEnterpriseBuyer || isEnterpriseSeller) && (
            <MyRequestsNavButton
              isEnterpriseSeller={isEnterpriseSeller}
              userInfo={userInfo}
              onClick={onClose}
            />
          )}
        </Stack>
      </Stack>

      <Stack gap="4px">
        {!isEnterpriseBuyer && !isEnterpriseSeller && (
          <NavButton to="/dev-library" icon={MdCode} onClick={onClose}>
            Developer Tools
          </NavButton>
        )}
        <NavButton to="/support" icon={MdSupport} onClick={onClose}>
          Support & Feedback
        </NavButton>
        <HasRole currentRole={currentRole} allowed={['ROLE_SUPER_ADMIN']}>
          <NavButton to="/environment" icon={MdScubaDiving} onClick={onClose}>
            Environment Details
          </NavButton>
        </HasRole>
        <Divider mt="20px" mb="20px" borderColor="primary.600" />

        <Flex justify="space-between" align="center">
          <Flex align="center">
            <Avatar
              src={userInfo?.picture}
              name={printPersonName(userInfo)}
              boxSize="10"
            />
            <Box ml="3" color="white">
              <Text fontWeight="500" fontSize={14}>
                {printPersonName(userInfo)}
              </Text>
              <Text fontWeight="400" fontSize={14}>
                {userInfo?.role?.displayName}
              </Text>
            </Box>
          </Flex>
          <IconButton
            data-testid="logout"
            onClick={handleLogout}
            aria-label="log out"
            color="white"
            variant="ghost"
            fontSize={22}
            _hover={{ bg: 'whiteAlpha.200' }}
          >
            <Icon as={MdLogout} />
          </IconButton>
        </Flex>
      </Stack>
    </Flex>
  )
}
