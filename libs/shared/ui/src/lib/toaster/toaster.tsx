'use client'

import type { CreateToasterReturn } from '@chakra-ui/react'
import {
  createToaster,
  Portal,
  Spinner,
  Toast,
  Toaster as ChakraToaster
} from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import type { ReactNode } from 'react'

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

export const createAppToaster = (
  options: ToasterOptions = {}
): CreateToasterReturn => {
  return createToaster({
    ...defaultOptions,
    ...options
  })
}

export const toaster = createAppToaster()

interface ToastRenderData {
  type?: string
  title?: ReactNode
  description?: ReactNode
  action?: { label?: ReactNode }
  closable?: boolean
}

export interface ToasterProps {
  toaster?: CreateToasterReturn
  insetInline?: Record<string, string | number> | string | number
}

export const Toaster = ({
  toaster: toasterInstance = toaster,
  insetInline = { mdDown: '4' }
}: ToasterProps) => {
  return (
    <Portal>
      <ChakraToaster toaster={toasterInstance} insetInline={insetInline}>
        {(toast: ToastRenderData) => (
          <Toast.Root width={{ md: 'sm' }}>
            {toast.type === 'loading' ? (
              <Spinner size="sm" color="blue.solid" />
            ) : (
              <Toast.Indicator />
            )}
            <VStack gap="1" flex="1" maxWidth="100%" align="stretch">
              {toast.title ? <Toast.Title>{toast.title}</Toast.Title> : null}
              {toast.description ? (
                <Toast.Description>{toast.description}</Toast.Description>
              ) : null}
            </VStack>
            {toast.action ? (
              <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
            ) : null}
            {toast.closable ? <Toast.CloseTrigger /> : null}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}

export type { CreateToasterReturn }
