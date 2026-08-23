import { useState } from 'react'
import { CloseButton } from '@chakra-ui/react'

import {
  AddIcon,
  AlertRoot,
  Button,
  Container,
  Input,
  Portal,
  Text
} from '../../index'
import { type DrawerRootProps, Drawer } from '../drawer'

export function WithFormLibraryHooks(args: DrawerRootProps) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Container maxW="600px">
        <Text mb={4}>
          If you need to put a form within the Drawer, you might need to use a
          form validation library like react-hook-form or formik. Here&apos;s
          the recommended way to do it:
        </Text>
        <AlertRoot
          status="warning"
          variant="subtle"
          borderLeftWidth="4px"
          borderLeftColor="orange.500"
          mb={6}
        >
          Because the button is located outside the form, you can leverage its
          native HTML form attribute and refer to the id of the form.
        </AlertRoot>
        <Button onClick={() => setOpen(true)} maxW="150px">
          <AddIcon />
          Open
        </Button>
      </Container>

      <Drawer.Root
        open={open}
        onOpenChange={(e: { open: boolean }) => setOpen(e.open)}
        {...args}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.CloseTrigger asChild>
                <CloseButton />
              </Drawer.CloseTrigger>
              <Drawer.Header>Create your account</Drawer.Header>

              <Drawer.Body>
                <form
                  id="my-form"
                  onSubmit={e => {
                    e.preventDefault()
                    // eslint-disable-next-line no-console
                    console.log('submitted')
                  }}
                >
                  <Input name="nickname" placeholder="Type here..." />
                </form>
              </Drawer.Body>

              <Drawer.Footer>
                <Button type="submit" form="my-form">
                  Save
                </Button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  )
}
