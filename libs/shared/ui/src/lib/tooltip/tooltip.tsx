import * as React from 'react'
import { Portal, Tooltip as ChakraTooltip } from '@chakra-ui/react'

export interface TooltipProps
  extends Omit<ChakraTooltip.RootProps, 'children'> {
  showArrow?: boolean
  hasArrow?: boolean
  children: React.ReactNode
  disabled?: boolean
  portalled?: boolean
  content?: React.ReactNode
  label?: React.ReactNode
  contentProps?: ChakraTooltip.ContentProps
  portalRef?: React.RefObject<HTMLElement>
  placement?: any // ChakraTooltip.PositioningOptions['placement'] - simplified to avoid namespace issues for now
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow,
      hasArrow,
      children,
      disabled,
      portalled = true,
      content,
      label,
      contentProps,
      portalRef,
      placement,
      positioning,
      ...rest
    } = props

    const tooltipContent = content ?? label
    const tooltipShowArrow = showArrow ?? hasArrow
    const tooltipPositioning =
      positioning ?? (placement ? { placement } : undefined)

    if (disabled) return children

    return (
      <ChakraTooltip.Root positioning={tooltipPositioning} {...rest}>
        <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraTooltip.Positioner>
            <ChakraTooltip.Content ref={ref} {...contentProps}>
              {tooltipShowArrow && (
                <ChakraTooltip.Arrow>
                  <ChakraTooltip.ArrowTip />
                </ChakraTooltip.Arrow>
              )}
              {tooltipContent}
            </ChakraTooltip.Content>
          </ChakraTooltip.Positioner>
        </Portal>
      </ChakraTooltip.Root>
    )
  }
)
