import * as React from 'react'

import { Button } from '../../button/button'
import {
  DialogBackdrop,
  DialogContent,
  DialogPositioner,
  DialogRoot
} from '../../dialog/dialog'
import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithDialogTooltip() {
  const [showDialog, setShowDialog] = React.useState(false)
  return (
    <div>
      <Button onClick={() => setShowDialog(true)}>Show Dialog</Button>
      <DialogRoot
        open={showDialog}
        onOpenChange={e => {
          if (!e.open) setShowDialog(false)
        }}
      >
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent height="300px">
            <div>
              <Button onClick={() => setShowDialog(false)}>Close Dialog</Button>
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button>
                    <span aria-hidden>🔔</span>
                  </Button>
                </TooltipTrigger>
                <TooltipPositioner>
                  <TooltipContent>Notifications</TooltipContent>
                </TooltipPositioner>
              </TooltipRoot>
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button>
                    <span aria-hidden>⚙️</span>
                  </Button>
                </TooltipTrigger>
                <TooltipPositioner>
                  <TooltipContent>Settings</TooltipContent>
                </TooltipPositioner>
              </TooltipRoot>
              <TooltipRoot>
                <TooltipTrigger asChild>
                  <Button>
                    <span aria-hidden>💾</span> Save
                  </Button>
                </TooltipTrigger>
                <TooltipPositioner>
                  <TooltipContent>Your files are safe with us</TooltipContent>
                </TooltipPositioner>
              </TooltipRoot>

              <div style={{ float: 'right' }}>
                <TooltipRoot>
                  <TooltipTrigger asChild>
                    <Button>
                      <span role="img" aria-label="Bell">
                        🔔
                      </span>
                      <span>3</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipPositioner>
                    <TooltipContent aria-label="3 Notifications">
                      Notifications
                    </TooltipContent>
                  </TooltipPositioner>
                </TooltipRoot>
              </div>
            </div>
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    </div>
  )
}
