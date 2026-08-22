import { MdInfoOutline } from 'react-icons/md'

import { Icon } from '../../icon/icon'

import {
  TooltipArrow,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithExternalIconTooltip() {
  return (
    <TooltipRoot positioning={{ placement: 'right' }}>
      <TooltipTrigger asChild>
        <span>
          <Icon as={MdInfoOutline} boxSize={6} color="gray.500" />
        </span>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>
          <TooltipArrow />
          Hello I am a tooltip with an external icon. Please wrap the Icon in a
          span so that I appear next to the Icon.
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}
