import { forwardRef, ReactElement, useImperativeHandle } from 'react'
import { FieldErrors } from 'react-hook-form'
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
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
    const { isOpen, onClose } = useDisclosure({ defaultIsOpen: true })

    useImperativeHandle(ref, () => ({
      handleOnClose() {
        onClose()
      }
    }))

    return (
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        closeOnEsc
        isFullHeight
        preserveScrollBarGap
        onCloseComplete={handleOnCloseComplete}
        size={{ base: 'full', md: 'lg' }}
      >
        <DrawerOverlay />
        <DrawerContent pt={6}>
          <DrawerCloseButton />
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
              isDisabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              colorScheme="brand"
              isDisabled={isLoading || !isValid}
              isLoading={isLoading}
              type="submit"
              onClick={() => handleOnSubmit()}
            >
              {ctaText}
            </Button>
          </DrawerFooter>
        </DrawerContent>

        {/* <DevTool control={control} /> */}
      </Drawer>
    )
  }
)

CustomDrawer.displayName = 'CustomDrawer'
