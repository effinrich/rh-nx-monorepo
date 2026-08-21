import { forwardRef, ReactElement, useImperativeHandle } from 'react'
import { FieldErrors } from 'react-hook-form'
import {
  Button,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerPositioner,
  DrawerRoot,
  Text,
  useDisclosure
} from '@redesignhealth/ui'

import { AxiosErrorAlert } from '../axios-error-alert/axios-error-alert'

interface CustomDrawerProps {
  title: string
  children: ReactElement
  description?: string
  errors: FieldErrors
  isLoading: boolean
  isError: boolean
  ctaText?: string
  isValid?: boolean
  handleOnSubmit: () => void
  handleOnCloseComplete?: () => void
}

export const CustomDrawer = forwardRef(
  (
    {
      title,
      description,
      children,
      isLoading,
      isError,
      ctaText = 'Submit',
      isValid,
      errors,
      handleOnSubmit,
      handleOnCloseComplete
    }: CustomDrawerProps,
    ref
  ) => {
    const { open, onClose } = useDisclosure({ defaultOpen: true })

    useImperativeHandle(ref, () => ({
      handleOnClose() {
        onClose()
      }
    }))

    return (
      <DrawerRoot
        open={open}
        placement="end"
        onOpenChange={(e: { open: boolean }) => { if (!e.open) { onClose(); handleOnCloseComplete?.() } }}
        size={{ base: 'full', md: 'lg' }}
      >
        <DrawerBackdrop />
        {/* @ts-expect-error Chakra v3 DrawerPositioner children type mismatch */}
        <DrawerPositioner>
          {/* @ts-expect-error Chakra v3 DrawerContent children type mismatch */}
          <DrawerContent pt={6}>
            <DrawerCloseTrigger />
            <DrawerHeader borderBottomWidth="1px" fontSize="30px">
              {title}
              {description && (
                <Text
                  as="p"
                  my="4px"
                  fontSize="14px"
                  lineHeight="20px"
                  fontWeight="normal"
                  color="gray.500"
                >
                  {description}
                </Text>
              )}
            </DrawerHeader>
            <DrawerBody py={6}>
              {isError && (
                <AxiosErrorAlert
                  error={errors?.root?.serverError.message}
                  mb={3}
                />
              )}
              {children}
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button
                variant="outline"
                mr={3}
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                colorPalette="brand"
                disabled={isLoading || !isValid}
                loading={isLoading}
                type="submit"
                onClick={() => handleOnSubmit()}
              >
                {ctaText}
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    )
  }
)

CustomDrawer.displayName = 'CustomDrawer'
