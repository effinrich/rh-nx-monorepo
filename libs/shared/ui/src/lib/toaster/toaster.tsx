'use client'

// Chakra UI v3: Toaster
// - Uses createToaster() to create a toaster instance
// - Toaster component renders toast notifications via Portal
// See: https://chakra-ui.com/docs/components/toaster

import type {
  CreateToasterReturn,
  ToastActionTriggerProps
} from '@chakra-ui/react'
import {
  createToaster,
  Portal,
  Spinner,
  Stack,
  Toast,
  Toaster as ChakraToaster
} from '@chakra-ui/react'

export interface ToasterOptions {
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
  pauseOnPageIdle?: boolean
  pauseOnInteraction?: boolean
  max?: number
  duration?: number
}

const defaultOptions: ToasterOptions = {
  placement: 'bottom-end',
  pauseOnPageIdle: true
}

/**
 * Creates a toaster instance for displaying toast notifications.
 * @param options - Configuration options for the toaster
 * @returns A toaster instance with methods like toast(), success(), error(), etc.
 */
export const createAppToaster = (
  options: ToasterOptions = {}
): CreateToasterReturn => {
  return createToaster({
    ...defaultOptions,
    ...options
  })
}

// Default toaster instance for convenience
export const toaster = createAppToaster()

export interface ToasterProps {
  /** The toaster instance to use */
  toaster?: CreateToasterReturn
  /** Inline inset for mobile devices */
  insetInline?: Record<string, string | number> | string | number
}

/**
 * Toaster component that renders toast notifications.
 * Must be placed at the root of your app, typically in the provider.
 */
export const Toaster = ({
  toaster: toasterInstance = toaster,
  insetInline = { mdDown: '4' }
}: ToasterProps) => {
  return (
    <Portal>
      <ChakraToaster toaster={toasterInstance} insetInline={insetInline}>
        {toast => (
          <Toast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <Stack gap="1" flex="1" maxWidth="100%">
              {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
              {toast.description && (
                <Toast.Description>{toast.description}</Toast.Description>
              )}
            </Stack>
            {toast.action && (
              <Toast.ActionTrigger>
                {(toast.action as ToastActionTriggerProps).label}
              </Toast.ActionTrigger>
            )}
            {toast.closable && <Toast.CloseTrigger />}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}

// Re-export toast types for convenience
export type { CreateToasterReturn }
