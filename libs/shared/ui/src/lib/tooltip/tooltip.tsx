import * as React from 'react'
import { Portal, Tooltip as ChakraTooltip } from '@chakra-ui/react'

// Re-export Chakra v3 compound components for direct usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TooltipRoot = ChakraTooltip.Root as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TooltipTrigger = ChakraTooltip.Trigger as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TooltipContent = ChakraTooltip.Content as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TooltipArrow = ChakraTooltip.Arrow as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const TooltipPositioner = ChakraTooltip.Positioner as any

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

    // Use re-exported components to avoid Chakra v3 compound component typing issues
    const Trigger = ChakraTooltip.Trigger as React.ElementType
    const Positioner = ChakraTooltip.Positioner as React.ElementType
    const Content = ChakraTooltip.Content as React.ElementType
    const Arrow = ChakraTooltip.Arrow as React.ElementType
    const ArrowTip = ChakraTooltip.ArrowTip as React.ElementType

    return (
      <ChakraTooltip.Root positioning={tooltipPositioning} {...rest}>
        <Trigger asChild>{children}</Trigger>
        <Portal disabled={!portalled} container={portalRef?.current}>
          <Positioner>
            <Content ref={ref} {...contentProps}>
              {tooltipShowArrow && (
                <Arrow>
                  <ArrowTip />
                </Arrow>
              )}
              {tooltipContent}
            </Content>
          </Positioner>
        </Portal>
      </ChakraTooltip.Root>
    )
  }
)
