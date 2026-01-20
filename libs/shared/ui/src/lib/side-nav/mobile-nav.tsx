import { useDisclosure } from '@chakra-ui/react'

import { Box } from '../box/box'
import { Drawer, DrawerContent, DrawerOverlay } from '../drawer/drawer'
import { Flex } from '../flex/flex'
import { RedesignLogo } from '../logos/redesign-logo/redesign-logo'

import { Nav } from './nav'
import { ToggleButton } from './toggle-button'

export const MobileNav = ({ userProfile, numOpcos, numPersons }: any) => {
  const { open, onToggle, onClose } = useDisclosure()

  return (
    <Box
      width="full"
      py="4"
      px={{ base: '4', md: '8' }}
      bg="white"
      borderBottom="2px"
      borderColor="gray.200"
    >
      <Flex justify="space-between" alignItems="center">
        <RedesignLogo
          w={{ base: '200px', md: '225px' }}
          alt="Redesign Health logo"
        />
        <ToggleButton
          open={open}
          aria-label="Open Menu"
          onClick={onToggle}
        />
        <Drawer
          open={open}
          placement="left"
          onClose={onClose}
          isFullHeight
          preserveScrollBarGap
          closeOnEsc
        >
          <DrawerOverlay />
          <DrawerContent>
            <Nav
              userProfile={userProfile}
              numOpcos={numOpcos}
              numPersons={numPersons}
              onClose={onClose}
            />
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  )
}

export default MobileNav
