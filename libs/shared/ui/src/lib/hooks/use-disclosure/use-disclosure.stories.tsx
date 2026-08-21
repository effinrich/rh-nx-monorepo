import { Meta, StoryObj } from '@storybook/react-vite'

import { DrawerExample } from './partials/drawer-example'
import { StoryWithHooks } from './partials/story-with-hooks'

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
  render: () => <DrawerExample />,
  args: {},
  parameters: {
    docs: {
      source: {
        code: `const WithDrawer = () => {
    const { open, onOpen, onClose } = useDisclosure()

    return (
      <>
        <Button onClick={onOpen}>Open Drawer</Button>
        <DrawerRoot placement="right" onOpenChange={({ open: isOpen }) => { if (!isOpen) onClose() }} open={open}>
          <DrawerBackdrop />
          <DrawerPositioner>
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
              <DrawerBody>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
              </DrawerBody>
            </DrawerContent>
          </DrawerPositioner>
        </DrawerRoot>
      </>
    )
  }`,
        language: 'typescript',
        type: 'auto'
      }
    }
  }
}

export const WithGetProps: StoryObj = {
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
