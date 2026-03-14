import * as React from 'react'
import { MdInfoOutline } from 'react-icons/md'

import { Button } from '../button/button'
import { Icon } from '../icon/icon'
import { Modal, ModalContent, ModalOverlay } from '../modal/modal'
import { rh } from '../rh/rh'

import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipArrow,
  TooltipPositioner
} from './tooltip'

export default {
  title: 'Components / Overlay / Tooltip'
}

export const WithButton = () => (
  <TooltipRoot positioning={{ placement: 'bottom' }}>
    <TooltipTrigger asChild>
      <Button>Hover me</Button>
    </TooltipTrigger>
    <TooltipPositioner>
      <TooltipContent>
        <TooltipArrow />
        This is a rh tooltip
      </TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
)

export const WithString = () => (
  <TooltipRoot>
    <TooltipTrigger asChild>
      <span>Hover me</span>
    </TooltipTrigger>
    <TooltipPositioner>
      <TooltipContent>This is a rh tooltip</TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
)

export const WithAriaLabel = () => (
  <TooltipRoot>
    <TooltipTrigger asChild>
      <Button style={{ fontSize: 25 }}>
        <span role="img" aria-label="notification">
          🔔
        </span>
        <span>3</span>
      </Button>
    </TooltipTrigger>
    <TooltipPositioner>
      <TooltipContent bg="tomato" color="white" aria-label="3 Notifications">
        <TooltipArrow />
        Notifications
      </TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
)

export const WithinFixedContainer = () => (
  <div
    style={{
      position: 'fixed',
      background: 'red',
      height: '100px',
      width: '200px'
    }}
  >
    <TooltipRoot>
      <TooltipTrigger asChild>
        <span>Hi</span>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent aria-label="hello">Hello</TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  </div>
)

export const WithModal = () => {
  const [showDialog, setShowDialog] = React.useState(false)
  return (
    <div>
      <Button onClick={() => setShowDialog(true)}>Show Dialog</Button>
      <Modal isOpen={showDialog} onClose={() => setShowDialog(false)}>
        <ModalOverlay />
        {/* @ts-expect-error Chakra v3 DialogContent children typing */}
        <ModalContent height="300px">
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
        </ModalContent>
      </Modal>
    </div>
  )
}

export const WithDisabledButton = () => (
  <TooltipRoot>
    <TooltipTrigger asChild>
      <Button disabled>Can't Touch This</Button>
    </TooltipTrigger>
    <TooltipPositioner>
      <TooltipContent>Oh oh oh, oh oh</TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
)

export const WithWrappedDisabledButton = () => (
  <TooltipRoot>
    <TooltipTrigger asChild>
      <span>
        <Button disabled>Hover me</Button>
      </span>
    </TooltipTrigger>
    <TooltipPositioner>
      <TooltipContent>Hello world</TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
)

export const WithIsOpenProp = () => (
  <TooltipRoot open>
    <TooltipTrigger asChild>
      <Button disabled>Can't Touch This</Button>
    </TooltipTrigger>
    <TooltipPositioner>
      <TooltipContent>
        <TooltipArrow />
        Hello world
      </TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
)

export const WithDefaultIsOpenProp = () => (
  <TooltipRoot defaultOpen>
    <TooltipTrigger asChild>
      <Button>Can't Touch This</Button>
    </TooltipTrigger>
    <TooltipPositioner>
      <TooltipContent>Hello world</TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
)

export const WithAutoPlacement = () => (
  <TooltipRoot positioning={{ placement: 'bottom' }}>
    <TooltipTrigger asChild>
      <Button>Can't Touch This</Button>
    </TooltipTrigger>
    <TooltipPositioner>
      <TooltipContent>
        <TooltipArrow />
        Hello world
      </TooltipContent>
    </TooltipPositioner>
  </TooltipRoot>
)

export const WithScroll = () => (
  <rh.div border="solid 1px red" h="200vh" pt="48">
    <TooltipRoot closeOnScroll positioning={{ placement: 'bottom' }}>
      <TooltipTrigger asChild>
        <Button mt="300px">Can't Touch This</Button>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>
          <TooltipArrow />
          Hello world
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  </rh.div>
)

export const WithScrollWithin = () => (
  <rh.div border="solid 1px red" pt="48" height="400px" overflow="auto">
    <TooltipRoot closeOnScroll positioning={{ placement: 'bottom' }}>
      <TooltipTrigger asChild>
        <Button mt="180px" mb="80px">
          Can't Touch This
        </Button>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>
          <TooltipArrow />
          Hello world
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  </rh.div>
)

export const WithDynamicDisabled = () => {
  const [isDisabled, setIsDisabled] = React.useState(false)
  const handleDisabled = () => setIsDisabled(true)
  const handleEnabled = () => setIsDisabled(false)
  return (
    <TooltipRoot
      positioning={{ placement: 'bottom' }}
      openDelay={500}
      disabled={isDisabled}
    >
      <TooltipTrigger asChild>
        <rh.span
          draggable
          onDragStart={handleDisabled}
          onDragEnd={handleEnabled}
          cursor="grab"
        >
          Drag me, and you won't see
        </rh.span>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>
          <TooltipArrow />
          Disabled after being triggered
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}

// https://chakra-ui.com/docs/components/tooltip#with-an-icon
export const WithExternalIcon = () => {
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
