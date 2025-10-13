import { useBreakpointValue } from '@chakra-ui/react'

import { MobileNav } from './mobile-nav'
import { Nav } from './nav'

export const SideNav = ({
  userProfile,
  numOpcos,
  numPersons,
  router,
  logOut
}: any) => {
  const isDesktop = useBreakpointValue({ base: false, lg: true })
  return isDesktop ? (
    <Nav
      router={router}
      logOut={logOut}
      userProfile={userProfile}
      numOpcos={numOpcos}
      numPersons={numPersons}
    />
  ) : (
    <MobileNav router={router} logOut={logOut} />
  )
}

export default SideNav
