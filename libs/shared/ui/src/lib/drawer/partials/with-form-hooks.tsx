import { useRef, useState } from 'react'
import { CloseButton } from '@chakra-ui/react'

import {
  AddIcon,
  Box,
  Button,
  Input,
  NativeSelectField,
  NativeSelectRoot,
  Portal,
  Stack,
  Textarea
} from '../../index'
import { type DrawerRootProps,Drawer } from '../drawer'

export function WithFormHooks(args: DrawerRootProps) {
  const [open, setOpen] = useState(false)
  const firstField = useRef<HTMLInputElement>(null)
  return (
    <>
      <Button
        colorPalette="teal"
        onClick={() => setOpen(true)}
        maxW="150px"
      >
        <AddIcon />
        Create user
      </Button>
      <Drawer.Root
        open={open}
        placement="end"
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
              <Drawer.Header borderBottomWidth="1px">
                Create a new account
              </Drawer.Header>

              <Drawer.Body>
                <Stack gap="24px">
                  <Box>
                    <label htmlFor="username">Name</label>
                    <Input
                      ref={firstField}
                      id="username"
                      placeholder="Please enter user name"
                    />
                  </Box>

                  <Box>
                    <label htmlFor="url">Url</label>
                    <Input
                      type="url"
                      id="url"
                      placeholder="Please enter domain"
                    />
                  </Box>

                  <Box>
                    <label htmlFor="owner">Select Owner</label>
                    <NativeSelectRoot id="owner">
                      <NativeSelectField defaultValue="segun">
                        <option value="segun">Segun Adebayo</option>
                        <option value="kola">Kola Tioluwani</option>
                      </NativeSelectField>
                    </NativeSelectRoot>
                  </Box>

                  <Box>
                    <label htmlFor="desc">Description</label>
                    <Textarea id="desc" />
                  </Box>
                </Stack>
              </Drawer.Body>

              <Drawer.Footer borderTopWidth="1px">
                <Button
                  variant="outline"
                  mr={3}
                  onClick={() => setOpen(false)}
                  colorPalette="red"
                >
                  Cancel
                </Button>
                <Button colorPalette="brand">Submit</Button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  )
}
