import { LuChevronDown } from 'react-icons/lu'

import { IconButton } from '../../icon-button/icon-button'

import { Button, ButtonGroup } from '../button'

export function WithAttachedButtonsButton() {
  return (
    <ButtonGroup size="sm" attached variant="outline">
      <Button>Save</Button>
      <Button>Cancel</Button>
      <IconButton fontSize="2xl" aria-label="Add to friends">
        <LuChevronDown />
      </IconButton>
    </ButtonGroup>
  )
}
