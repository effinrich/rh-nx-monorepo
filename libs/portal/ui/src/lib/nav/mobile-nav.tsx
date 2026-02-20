import type { UserInfoSummary } from '@redesignhealth/portal/data-assets'
import {
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  IconButton,
  RedesignLogo,
  rh,
  useDisclosure
} from '@redesignhealth/ui'

import { Nav } from './nav'

export interface CompanyOptionProp {
  id: string
  label: string
}

interface MobileNavProps {
  userInfo: UserInfoSummary
}

const Bar = rh('span', {
  baseStyle: {
    display: 'block',
    pos: 'absolute',
    w: '1.25rem',
    h: '0.125rem',
    bg: 'white',
    mx: 'auto',
    insetStart: '0.55rem',
    transition: 'all 0.12s'
  }
})

export const MobileNav = ({ userInfo }: MobileNavProps) => {
  const { open, onToggle, onClose } = useDisclosure()

  return (
    <Box
      as="header"
      justifyContent="space-between"
      alignItems="center"
      w="100%"
      borderColor="transparent"
      bg="galaxy.500"
      py={4}
      px={{ base: 5, md: 8 }}
      display={{ base: 'flex', lg: 'none' }}
      position="sticky"
      top={0}
      left={0}
      zIndex="docked"
    >
      <RedesignLogo
        alt="Redesign Health logo"
        w={{ base: '225px', md: '250px' }}
      />

      <IconButton
        aria-label={`${open ? 'close' : 'open'} navigation menu`}
        variant="unstyled"
        onClick={onToggle}
        size="sm"
      >
        <Box
          className="group"
          data-active={open ? '' : undefined}
          w="1.5rem"
          h="1.5rem"
          pos="relative"
          aria-hidden
          pointerEvents="none"
        >
          <Bar
            top="0.4375rem"
            _groupActive={{ top: '0.6875rem', transform: 'rotate(45deg)' }}
          />
          <Bar
            bottom="0.4375rem"
            _groupActive={{
              bottom: '0.6875rem',
              transform: 'rotate(-45deg)'
            }}
          />
        </Box>
      </IconButton>

      <Drawer
        open={open}
        placement="start"
        onOpenChange={e => !e.open && onClose()}
      >
        <DrawerOverlay display={{ lg: 'none' }} />
        <DrawerContent display={{ lg: 'none' }}>
          <Nav onClose={onClose} userInfo={userInfo} />
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
