import {
  MdCorporateFare,
  MdHomeFilled,
  MdPeople,
  MdSupport
} from 'react-icons/md'
import { useColorModeValue } from '@chakra-ui/react'

import { Divider } from '../divider/divider'
import { Flex } from '../flex/flex'
import { RedesignLogo } from '../logos/redesign-logo/redesign-logo'
import { Stack } from '../stack/stack'

import { NavButton } from './nav-button'
import { UserProfile } from './user-profile'

export const Nav = ({
  userProfile,
  numOpcos,
  numPersons,
  router,
  logOut
}: any) => {
  const bgColor = useColorModeValue('white', 'blackAlpha.500')
  const borderColor = useColorModeValue('gray.200', 'gray.200')

  const IconMap: any = {
    dashboard: MdHomeFilled,
    opcos: MdCorporateFare,
    users: MdPeople
  }

  const EntityCountMap: any = {
    'op-cos': numOpcos,
    users: numPersons
  }

  const routes = router.routes[0].children.filter((route: any) => route)

  return (
    <Flex
      flex="1"
      bg={bgColor}
      color="on-accent"
      overflowY="auto"
      maxW={{ base: 'full', sm: 'xs' }}
      py={{ base: '6', sm: '8' }}
      px={{ base: '4', sm: '6' }}
      borderRight="2px"
      borderColor={borderColor}
    >
      <Stack justify="space-between" spacing="1">
        <Stack spacing={{ base: '5', sm: '6' }} shouldWrapChildren>
          <RedesignLogo maxW="250px" />
          <Stack spacing="1">
            {routes.length > 0 &&
              routes.map(
                (route: any) =>
                  route.path !== 'sign-in' && (
                    <NavButton
                      key={route.id}
                      label={
                        route.index
                          ? 'Dashboard'
                          : `${route.path} (${
                              EntityCountMap[route.path && route.path]
                            })`
                      }
                      path={route.index ? '/' : route.path}
                      icon={
                        IconMap[
                          route.index && route.path !== 'sign-in'
                            ? 'dashboard'
                            : route.path
                        ]
                      }
                    />
                  )
              )}
          </Stack>
        </Stack>
        <Stack spacing={{ base: '5', sm: '6' }}>
          <Stack spacing="1">
            <NavButton label="Support" icon={MdSupport} path="support" />
          </Stack>
          <Divider borderColor={borderColor} />
          <UserProfile
            name={`${userProfile.givenName} ${userProfile.familyName}`}
            image={userProfile.picture}
            email={userProfile.email}
            logOut={logOut}
            userRole={['admin']}
          />
        </Stack>
      </Stack>
    </Flex>
  )
}

export default Nav
