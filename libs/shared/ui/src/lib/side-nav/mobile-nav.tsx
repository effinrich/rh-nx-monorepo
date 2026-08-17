import { useDisclosure } from '../hooks/use-disclosure/use-disclosure'

import { Box } from '../box/box'
<<<<<<< HEAD
import { Drawer, DrawerContent, DrawerOverlay } from '../drawer/drawer'
=======
import { Drawer } from '../drawer/drawer'
>>>>>>> origin/main
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
<<<<<<< HEAD
        <ToggleButton open={open} aria-label="Open Menu" onClick={onToggle} />
        <Drawer
=======
        <ToggleButton
          open={open}
          aria-label="Open Menu"
          onClick={onToggle}
        />
        <Drawer.Root
>>>>>>> origin/main
          open={open}
          placement="start"
          onOpenChange={(e: { open: boolean }) => !e.open && onClose()}
        >
          <Drawer.Backdrop />
          {/* @ts-expect-error Chakra v3 Drawer.Positioner children type mismatch */}
          <Drawer.Positioner>
            {/* @ts-expect-error Chakra v3 Drawer.Content children type mismatch */}
            <Drawer.Content>
              <Nav
                userProfile={userProfile}
                numOpcos={numOpcos}
                numPersons={numPersons}
                onClose={onClose}
              />
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Root>
      </Flex>
    </Box>
  )
}

export default MobileNav
