/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-multi-comp */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import * as React from 'react'
import { useInterval } from 'react-use'

import {
  DrawerRoot,
  DrawerBody,
  DrawerContent,
  DrawerBackdrop,
  DrawerPositioner
} from '../drawer/drawer'
import { rh } from '../rh/rh'

import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger
} from './tabs'

export default {
  title: 'Components / Disclosure / Tabs',
  decorators: [
    (story: storiesOf) => (
      <rh.div maxWidth="500px" mt="100px" mx="auto">
        {story()}
      </rh.div>
    )
  ]
}

const variants = [
  'line',
  'enclosed',
  'enclosed-colored',
  'soft-rounded',
  'solid-rounded'
] as const

export const Variants = () =>
  variants.map(variant => (
    <rh.div key={variant} my="10">
      <pre>variant = {variant}</pre>
      <TabsRoot variant={variant} mt="3" defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="billings">Billings</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">Settings</TabsContent>
        <TabsContent value="billings">Billings</TabsContent>
      </TabsRoot>
    </rh.div>
  ))

const sizes = ['sm', 'md', 'lg'] as const

export const Sizes = () =>
  sizes.map(size => (
    <rh.div key={size} my="10">
      <pre>size = {size}</pre>
      <TabsRoot size={size} mt="3" defaultValue="settings">
        <TabsList>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="billings">Billings</TabsTrigger>
        </TabsList>
        <TabsContent value="settings">Settings</TabsContent>
        <TabsContent value="billings">Billings</TabsContent>
      </TabsRoot>
    </rh.div>
  ))

export const Automatic = () => (
  <>
    <p>manual</p>
    <TabsRoot activationMode="manual" defaultValue="settings">
      <TabsList>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="billings" disabled>
          Billings
        </TabsTrigger>
        <TabsTrigger value="preferences" disabled>
          Preferences
        </TabsTrigger>
        <TabsTrigger value="shutdown">Shut Down</TabsTrigger>
      </TabsList>
      <TabsContent value="settings">Settings</TabsContent>
      <TabsContent value="billings">Billings</TabsContent>
      <TabsContent value="preferences">Preferences</TabsContent>
      <TabsContent value="shutdown">Shut Down</TabsContent>
    </TabsRoot>
    <br />
    <p>auto</p>
    <TabsRoot defaultValue="settings">
      <TabsList>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="billings" disabled>
          Billings
        </TabsTrigger>
        <TabsTrigger value="preferences" disabled>
          Preferences
        </TabsTrigger>
        <TabsTrigger value="shutdown">Shut Down</TabsTrigger>
      </TabsList>
      <TabsContent value="settings">Settings</TabsContent>
      <TabsContent value="billings">Billings</TabsContent>
      <TabsContent value="preferences">Preferences</TabsContent>
      <TabsContent value="shutdown">Shut Down</TabsContent>
    </TabsRoot>
  </>
)

export const manual = () => (
  <TabsRoot activationMode="manual" defaultValue="settings">
    <TabsList>
      <TabsTrigger value="settings">Settings</TabsTrigger>
      <TabsTrigger value="billings">Billings</TabsTrigger>
      <TabsTrigger value="preferences" disabled>
        Preferences
      </TabsTrigger>
      <TabsTrigger value="shutdown">Shut Down</TabsTrigger>
    </TabsList>
    <TabsContent value="settings">Settings</TabsContent>
    <TabsContent value="billings">Billings</TabsContent>
    <TabsContent value="preferences">Preferences</TabsContent>
    <TabsContent value="shutdown">Shut Down</TabsContent>
  </TabsRoot>
)

export const withIndicator = () => (
  <TabsRoot variant="unstyled" activationMode="manual" defaultValue="settings">
    <TabsList>
      <TabsTrigger value="settings">Settings</TabsTrigger>
      <TabsTrigger value="billings" _disabled={{ color: 'gray.400' }} disabled>
        Billings
      </TabsTrigger>
      <TabsTrigger value="preferences">Preferences</TabsTrigger>
      <TabsTrigger value="shutdown">Shut Down</TabsTrigger>
    </TabsList>

    <TabsIndicator mt="-36px" zIndex={-1} height="34px" bg="green.200" />

    <TabsContent value="settings">Settings</TabsContent>
    <TabsContent value="billings">Billings</TabsContent>
    <TabsContent value="preferences">Preferences</TabsContent>
    <TabsContent value="shutdown">Shut Down</TabsContent>
  </TabsRoot>
)

export const withIndicatorAndLongTabText = () => (
  <TabsRoot variant="unstyled" activationMode="manual" defaultValue="long">
    <TabsList>
      <TabsTrigger value="long">Tab with long text</TabsTrigger>
      <TabsTrigger value="billings">Billings</TabsTrigger>
      <TabsTrigger value="preferences">Preferences</TabsTrigger>
      <TabsTrigger value="shutdown">Shut Down</TabsTrigger>
    </TabsList>
    <TabsIndicator mt="-36px" zIndex={-1} height="34px" bg="green.200" />
    <TabsContent value="long">Tab with long text</TabsContent>
    <TabsContent value="billings">Billings</TabsContent>
    <TabsContent value="preferences">Preferences</TabsContent>
    <TabsContent value="shutdown">Shut Down</TabsContent>
  </TabsRoot>
)

export const withVerticalTabs = () => (
  <TabsRoot orientation="vertical" defaultValue="settings">
    <TabsList>
      <TabsTrigger value="settings">Settings</TabsTrigger>
      <TabsTrigger value="billings">Billings</TabsTrigger>
      <TabsTrigger value="preferences" disabled>
        Preferences
      </TabsTrigger>
      <TabsTrigger value="shutdown">Shut Down</TabsTrigger>
    </TabsList>
    <TabsContent value="settings">Settings</TabsContent>
    <TabsContent value="billings">Billings</TabsContent>
    <TabsContent value="preferences">Preferences</TabsContent>
    <TabsContent value="shutdown">Shut Down</TabsContent>
  </TabsRoot>
)

const Interval = () => {
  const [value, setValue] = React.useState(0)
  useInterval(() => setValue(v => v + 1), 1000)
  return (
    <span style={{ fontWeight: 'bold', color: 'tomato', padding: 4 }}>
      {value}
    </span>
  )
}

export const withLazyTabs = () => (
  <TabsRoot defaultValue="1" lazyMount unmountOnExit>
    <TabsList>
      <TabsTrigger value="1">Interval 1</TabsTrigger>
      <TabsTrigger value="2">Interval 2</TabsTrigger>
    </TabsList>
    <TabsContent value="1">
      Interval 1:
      <Interval />
    </TabsContent>
    <TabsContent value="2">
      Interval 2:
      <Interval />
    </TabsContent>
  </TabsRoot>
)

export const withLazyTabsMounted = () => (
  <TabsRoot defaultValue="1" lazyMount>
    <TabsList>
      <TabsTrigger value="1">Interval 1</TabsTrigger>
      <TabsTrigger value="2">Interval 2</TabsTrigger>
    </TabsList>
    <TabsContent value="1">
      Interval 1:
      <Interval />
    </TabsContent>
    <TabsContent value="2">
      Interval 2:
      <Interval />
    </TabsContent>
  </TabsRoot>
)

export const WithSwappedTabs = () => {
  const initialData = [
    { id: 'a', value: 1 },
    { id: 'b', value: 5 }
  ]

  const TabView: React.FC<{
    items: typeof initialData
    selectedItemId: string
    setSelectedItemId: (id: string) => void
  }> = ({ items, selectedItemId, setSelectedItemId }) => {
    return (
      <TabsRoot
        value={selectedItemId}
        onValueChange={details => setSelectedItemId(details.value)}
        orientation="vertical"
        variant="enclosed-colored"
      >
        <TabsList minW="100px">
          {items.map(x => (
            <TabsTrigger key={x.id} value={x.id}>
              {x.id}: {x.value}
            </TabsTrigger>
          ))}
        </TabsList>
        {items.map(x => (
          <TabsContent key={x.id} value={x.id}>
            {x.id}: {x.value}
          </TabsContent>
        ))}
      </TabsRoot>
    )
  }

  const [items, setItems] = React.useState(initialData)
  const [selectedItemId, setSelectedItemId] = React.useState('a')

  const swapData = () => {
    setItems(items => {
      const [a, b] = items
      return [b, a]
    })
  }

  return (
    <rh.div m={4}>
      <button onClick={swapData}>Swap tab order</button>
      <TabView
        items={items}
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
      />
    </rh.div>
  )
}

export const withinDrawer = () => (
  <DrawerRoot open onOpenChange={console.log}>
    <DrawerBackdrop />
    <DrawerPositioner>
      <DrawerContent>
        <DrawerBody>
          <TabsRoot
            variant="unstyled"
            activationMode="manual"
            defaultValue="settings"
          >
            <TabsList>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="billings">Billings</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsIndicator zIndex={-1} height="4px" bg="green.200" />

            <TabsContent value="settings">Settings</TabsContent>
            <TabsContent value="billings">Billings</TabsContent>
            <TabsContent value="preferences">Preferences</TabsContent>
          </TabsRoot>
        </DrawerBody>
      </DrawerContent>
    </DrawerPositioner>
  </DrawerRoot>
)

export const WithTabPanelWrapper = () => (
  <TabsRoot defaultValue="first">
    <TabsList>
      <TabsTrigger value="first">FIrst Tab</TabsTrigger>
      <TabsTrigger value="second">Second Tab</TabsTrigger>
      <TabsTrigger value="third">Third Tab</TabsTrigger>
    </TabsList>
    <TabsContent value="first">Tab panel 1</TabsContent>
    <TabsContent value="second">Tab panel 2</TabsContent>
    <TabsContent value="third">Tab panel 3</TabsContent>
  </TabsRoot>
)
