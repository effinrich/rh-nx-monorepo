import { ReactNode } from 'react'
import { Form } from 'react-router-dom'
import {
  Box,
  CloseIcon,
  Separator,
  DrawerBackdrop,
  DrawerContent,
  DrawerPositioner,
  DrawerRoot,
  Flex,
  IconButton,
  Loader,
  Text,
  useDisclosure
} from '@redesignhealth/ui'

export const DrawerForm = (props: {
  children: ReactNode
  onClose?: () => void
  onCloseComplete?: () => void
  header: string
  description?: string
  loading?: boolean
  footer?: ReactNode
  fetcherForm?: typeof Form
  action?: string
  success?: ReactNode
}) => {
  const { open, onClose } = useDisclosure({ defaultOpen: true })

  const handleClose = () => {
    onClose()
    props.onClose?.()
  }

  return (
    <DrawerRoot
      open={open}
      placement="end"
      onOpenChange={(e: { open: boolean }) => {
        if (!e.open) {
          handleClose()
          props.onCloseComplete?.()
        }
      }}
      size={{ base: 'full', md: 'lg' }}
    >
      <DrawerBackdrop />
      <DrawerPositioner>
      <DrawerContent pt="12px">
        <Flex flexDir="column" h="100%">
          <IconButton
            aria-label="close form"
            onClick={handleClose}
            size="md"
            w="fit-content"
            ml="auto"
            variant="ghost"
            color="gray.500"
            mr="16px"
          >
            <CloseIcon />
          </IconButton>

          {props.success}

          {!props.success && (
            <>
              <Box px="24px">
                <Text
                  as="p"
                  mt="8px"
                  fontSize="30px"
                  lineHeight="38px"
                  fontWeight="semibold"
                  color="gray.900"
                >
                  {props.header}
                </Text>

                {props.description && (
                  <Text
                    as="p"
                    mt="4px"
                    fontSize="14px"
                    lineHeight="20px"
                    fontWeight="normal"
                    color="gray.500"
                  >
                    {props.description}
                  </Text>
                )}

                <Separator mt="24px" />
              </Box>

              <Flex
                as={props.fetcherForm ?? Form}
                method="post"
                noValidate
                action={props.action}
                flexDir="column"
                flex="1"
                py="24px"
                overflowY="scroll"
              >
                {props.loading && <Loader size="lg" />}
                <Box
                  display={props.loading ? 'none' : undefined}
                  flex="1"
                  px="24px"
                >
                  {props.children}
                </Box>

                {props.footer && (
                  <Box px="24px" py="16px" borderTopWidth="1px" mt="20px">
                    {props.footer}
                  </Box>
                )}
              </Flex>
            </>
          )}
        </Flex>
      </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  )
}

export default DrawerForm
