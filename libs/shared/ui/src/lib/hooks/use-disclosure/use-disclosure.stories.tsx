import { Meta, StoryObj } from '@storybook/react-vite'

import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text
} from '../../../index'

import { useDisclosure, UseDisclosureProps } from './use-disclosure'

const DrawerExample = () => {
  const { open, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen}>Open Drawer</Button>
      <Drawer placement="right" onClose={onClose} open={open}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
          <DrawerBody>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default {
  component: DrawerExample,
  title: 'Hooks / useDisclosure',
  args: {
    open: false
  },
  argTypes: {
    onOpen: { type: 'function' },
    onClose: { type: 'function' }
  }
} as Meta

export const WithDrawer = {
  args: {},

  parameters: {
    docs: {
      source: {
        code: `const WithDrawer = () => {
    const { open, onOpen, onClose } = useDisclosure()

    return (
      <>
        <Button onClick={onOpen}>Open Drawer</Button>
        <Drawer placement="right" onClose={onClose} open={open}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
            <DrawerBody>
              <p>Some contents...</p>
              <p>Some contents...</p>
              <p>Some contents...</p>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    )
  }`,
        language: 'typescript',
        type: 'auto'
      }
    }
  }
}

const StoryWithHooks = () => {
  // Sets the hooks for both the label and primary props
  const { getDisclosureProps, getButtonProps } = useDisclosure()

  const buttonProps = getButtonProps()
  const disclosureProps = getDisclosureProps()
  return (
    <>
      <Button {...buttonProps}>Toggle Me</Button>
      <Text {...disclosureProps} mt={4}>
        This text is being visibly toggled hidden and shown by the button.
        <br />
        (Inspect these components to see the rendered attributes)
      </Text>
    </>
  )
}

export const WithGetProps: StoryObj<UseDisclosureProps> = {
  render: () => <StoryWithHooks />,

  parameters: {
    docs: {
      source: {
        code: `export const WithGetProps = () => {
    const { getDisclosureProps, getButtonProps } = useDisclosure()

    const buttonProps = getButtonProps()
    const disclosureProps = getDisclosureProps()
    return (
      <>
        <Button {...buttonProps}>Toggle Me</Button>
        <Text {...disclosureProps} mt={4}>
          This text is being visibly toggled hidden and shown by the button.
          <br />
          (Inspect these components to see the rendered attributes)
        </Text>
      </>
    )
  }`,
        language: 'typescript',
        type: 'auto'
      }
    }
  }
}
