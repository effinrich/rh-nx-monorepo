/* eslint-disable react/no-multi-comp */
import { useRef, useState } from 'react'
import { CloseButton } from '@chakra-ui/react'

import { Meta } from '@storybook/react-vite'

import {
  AddIcon,
  AlertRoot,
  Box,
  Button,
  Container,
  Input,
  NativeSelectRoot,
  NativeSelectField,
  Stack,
  Text,
  Textarea,
  Wrap,
  WrapItem,
  Portal
} from '../../index'

import { Drawer } from './drawer'

export default {
  component: Drawer,
  title: 'Components / Overlay / Drawer',
  argTypes: {
    placement: {
      options: ['top', 'end', 'bottom', 'start'],
      control: { type: 'radio' }
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'full'],
      control: { type: 'radio' }
    }
  },
  args: {
    size: 'sm',
    placement: 'end'
  }
} as Meta<typeof Drawer>

const DrawerExampleHooks = (args: Drawer.RootProps) => {
  const { open, onClose } = { open: false, onClose: () => {} }
  const btnRef = useRef<HTMLButtonElement>(null)

  return (
    <Drawer.Root
      open={open}
      placement="end"
      onOpenChange={(e: { open: boolean }) => !e.open && onClose()}
      {...args}
    >
      <Drawer.Trigger asChild>
        <Button ref={btnRef} variant="outline" size="sm">
          Open
        </Button>
      </Drawer.Trigger>

      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header>
              <Drawer.Title>Create your account</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
              <Input placeholder="Type here..." />
            </Drawer.Body>

            <Drawer.Footer>
              <Button
                variant="outline"
                mr={3}
                onClick={onClose}
                colorPalette="red"
              >
                Cancel
              </Button>
              <Button colorPalette="blue">Save</Button>
            </Drawer.Footer>

            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  )
}

export const DrawerExample = {
  render: (args: any) => <DrawerExampleHooks {...args} />
}

const WithFormHooks = (args: any) => {
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

export const WithForm = {
  render: (args: any) => <WithFormHooks {...args} />
}

const WithFormLibraryHooks = (args: any) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Container maxW="600px">
        <Text mb={4}>
          If you need to put a form within the Drawer, you might need to use a
          form validation library like react-hook-form or formik. Here's the
          recommended way to do it:
        </Text>
        <AlertRoot status="warning" variant="left-accent" mb={6}>
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

export const WithFormLibrary = {
  render: (args: any) => <WithFormLibraryHooks {...args} />
}

const WithSizeHooks = (args: any) => {
  const [size, setSize] = useState('')
  const [open, setOpen] = useState(false)

  const handleClick = (newSize: string) => {
    setSize(newSize)
    setOpen(true)
  }

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'full']

  return (
    <>
      <Wrap>
        {sizes.map(s => (
          <WrapItem key={s}>
            <Button
              onClick={() => handleClick(s)}
              m={4}
            >{`Open ${s} Drawer`}</Button>
          </WrapItem>
        ))}
      </Wrap>
      <Drawer.Root
        open={open}
        onOpenChange={(e: { open: boolean }) => setOpen(e.open)}
        size={size as any}
        {...args}
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.CloseTrigger asChild>
                <CloseButton />
              </Drawer.CloseTrigger>
              <Drawer.Header>{`${size} drawer contents`}</Drawer.Header>
              <Drawer.Body>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  )
}

export const WithSize = {
  render: (args: any) => <WithSizeHooks {...args} />
}

const WithLongContentHooks = (args: any) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} maxW="150px">
        Open
      </Button>
      <Drawer.Root
        placement="bottom"
        onOpenChange={(e: { open: boolean }) => setOpen(e.open)}
        open={open}
        size="md"
        {...args}
      >
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content>
            <Drawer.Header borderBottomWidth="1px">Basic Drawer</Drawer.Header>
            <Drawer.Body>
              <Input placeholder="Type here..." my={4} />
              <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                suscipit, ligula sit amet pharetra accumsan, nulla augue fermentum
                dui, eget finibus diam sapien eget nisi.
              </Text>
            </Drawer.Body>
          </Drawer.Content>
        </Drawer.Positioner>
      </Drawer.Root>
    </>
  )
}

export const WithLongContent = {
  render: (args: any) => <WithLongContentHooks {...args} />
}
