import { type IconButtonProps, IconButton } from '../icon-button/icon-button'

import { ToggleIcon } from './toggle-icon'

export interface ToggleButtonProps extends Omit<IconButtonProps, 'children'> {
  open: boolean
}

export const ToggleButton = (props: ToggleButtonProps) => {
  const { open, ...iconButtonProps } = props
  return (
    <IconButton
      position="relative"
      variant="ghost"
      size="sm"
      color="on-accent"
      zIndex="skipLink"
      {...iconButtonProps}
    >
      <ToggleIcon active={open} />
    </IconButton>
  )
}
