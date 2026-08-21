---
id: drawer
category: overlay
title: Drawer
package: '@redesignhealth/ui'
description:
  The Drawer component is a panel that slides out from the edge of the screen.
  It can be useful when you need users to complete a task or view some details
  without leaving the current page.
---

# Drawer

## Import

```js
import {
  DrawerRoot,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerBackdrop,
  DrawerPositioner,
  DrawerContent,
  DrawerCloseTrigger
} from '@redesignhealth/ui'
```

## Usage

### Basic Drawer

```jsx
function DrawerExample() {
  const { open, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  return (
    <>
      <Button ref={btnRef} colorPalette="teal" onClick={onOpen}>
        Open
      </Button>
      <DrawerRoot
        open={open}
        placement="right"
        onOpenChange={e => {
          if (!e.open) onClose()
        }}
        finalFocusEl={() => btnRef.current}
      >
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent>
            <DrawerCloseTrigger />
            <DrawerHeader>Create your account</DrawerHeader>

            <DrawerBody>
              <Input placeholder="Type here..." />
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorPalette="blue">Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </>
  )
}
```

### Drawer placement

The Drawer can appear from any edge of the screen. Pass the `placement` prop and
set it to `top`, `right`, `bottom`, or `left`.

```jsx
function PlacementExample() {
  const { open, onOpen, onClose } = useDisclosure()
  const [placement, setPlacement] = React.useState('right')

  return (
    <>
      <RadioGroup defaultValue={placement} onChange={setPlacement}>
        <Stack direction="row" mb="4">
          <Radio value="top">Top</Radio>
          <Radio value="right">Right</Radio>
          <Radio value="bottom">Bottom</Radio>
          <Radio value="left">Left</Radio>
        </Stack>
      </RadioGroup>
      <Button colorPalette="blue" onClick={onOpen}>
        Open
      </Button>
      <DrawerRoot
        placement={placement}
        onOpenChange={e => {
          if (!e.open) onClose()
        }}
        open={open}
      >
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
}
```

### Focus on specific element

When a form is in the drawer, you might need to set focus on a specific element
when the drawer opens. Pass the `initialFocusRef` prop.

> Without the `initialFocusRef` prop, the drawer will set focus on the **first
> focusable element** when it opens.

```jsx
function DrawerExample() {
  const { open, onOpen, onClose } = useDisclosure()
  const firstField = React.useRef()

  return (
    <>
      <Button leftIcon={<AddIcon />} colorPalette="teal" onClick={onOpen}>
        Create user
      </Button>
      <DrawerRoot
        open={open}
        placement="right"
        initialFocusEl={() => firstField.current}
        onOpenChange={e => {
          if (!e.open) onClose()
        }}
      >
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent>
            <DrawerCloseTrigger />
            <DrawerHeader borderBottomWidth="1px">
              Create a new account
            </DrawerHeader>

            <DrawerBody>
              <Stack gap="24px">
                <Box>
                  <FieldLabel htmlFor="username">Name</FieldLabel>
                  <Input
                    ref={firstField}
                    id="username"
                    placeholder="Please enter user name"
                  />
                </Box>

                <Box>
                  <FieldLabel htmlFor="url">Url</FieldLabel>
                  <InputGroup>
                    <InputLeftAddon>http://</InputLeftAddon>
                    <Input
                      type="url"
                      id="url"
                      placeholder="Please enter domain"
                    />
                    <InputRightAddon>.com</InputRightAddon>
                  </InputGroup>
                </Box>

                <Box>
                  <FieldLabel htmlFor="owner">Select Owner</FieldLabel>
                  <NativeSelectRoot>
                    <NativeSelectField id="owner" defaultValue="segun">
                      <option value="segun">Segun Adebayo</option>
                      <option value="kola">Kola Tioluwani</option>
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Box>

                <Box>
                  <FieldLabel htmlFor="desc">Description</FieldLabel>
                  <Textarea id="desc" />
                </Box>
              </Stack>
            </DrawerBody>

            <DrawerFooter borderTopWidth="1px">
              <Button variant="outline" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button colorPalette="blue">Submit</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </>
  )
}
```

### Drawer Widths

Pass the `size` prop if you need to adjust the size of the drawer. Values can be
`xs`, `sm`, `md`, `lg`, `xl`, or `full`.

```jsx
function SizeExample() {
  const [size, setSize] = React.useState('')
  const { open, onOpen, onClose } = useDisclosure()

  const handleClick = newSize => {
    setSize(newSize)
    onOpen()
  }

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'full']

  return (
    <>
      {sizes.map(size => (
        <Button
          onClick={() => handleClick(size)}
          key={size}
          m={4}
        >{`Open ${size} Drawer`}</Button>
      ))}

      <DrawerRoot
        onOpenChange={e => {
          if (!e.open) onClose()
        }}
        open={open}
        size={size}
      >
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent>
            <DrawerCloseTrigger />
            <DrawerHeader>{`${size} drawer contents`}</DrawerHeader>
            <DrawerBody>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                Consequat nisl vel pretium lectus quam id. Semper quis lectus
                nulla at volutpat diam ut venenatis. Dolor morbi non arcu risus
                quis varius quam quisque. Massa ultricies mi quis hendrerit dolor
                magna eget est lorem. Erat imperdiet sed euismod nisi porta.
                Lectus vestibulum mattis ullamcorper velit.
              </p>
            </DrawerBody>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </>
  )
}
```

### Using a form in a Drawer

If you need to put a form within the Drawer, you might need to use to form
validation library like `react-hook-form` or `formik`. Here's the recommended
way to do it:

> Because the button is located outside the form, you can leverage its native
> HTML `form` attribute and refer to the `id` of the `form`.

```jsx
export const App = () => {
  const { open, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button onClick={onOpen}>Open</Button>
      <DrawerRoot
        open={open}
        onOpenChange={e => {
          if (!e.open) onClose()
        }}
      >
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent>
            <DrawerCloseTrigger />
            <DrawerHeader>Create your account</DrawerHeader>

            <DrawerBody>
              <form
                id="my-form"
                onSubmit={e => {
                  e.preventDefault()
                  console.log('submitted')
                }}
              >
                <Input name="nickname" placeholder="Type here..." />
              </form>
            </DrawerBody>

            <DrawerFooter>
              <Button type="submit" form="my-form">
                Save
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    </>
  )
}
```

## Accessibility

- When opening the Drawer, focus is trapped inside the Drawer.
- By default, the drawer sets focus on the first focusable element. If the
  `initialFocusRef` prop is passed, the drawer sets focus on the element with
  the assigned `ref`.
- After the drawer closes, it'll return focus to the element that triggered it.
