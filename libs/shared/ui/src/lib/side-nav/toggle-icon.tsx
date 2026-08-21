import { Box } from '../box/box'

import { ToggleBar } from './toggle-bar'

interface ToggleIconProps {
  active: boolean
}

export function ToggleIcon({ active }: ToggleIconProps) {
  return (
    <Box
      className="group"
      data-active={active ? '' : undefined}
      as="span"
      display="block"
      w="1.5rem"
      h="1.5rem"
      pos="relative"
      aria-hidden
      pointerEvents="none"
    >
      <ToggleBar
        top="0.4375rem"
        _groupActive={{ top: '0.6875rem', transform: 'rotate(45deg)' }}
      />
      <ToggleBar
        bottom="0.4375rem"
        _groupActive={{ bottom: '0.6875rem', transform: 'rotate(-45deg)' }}
      />
    </Box>
  )
}
