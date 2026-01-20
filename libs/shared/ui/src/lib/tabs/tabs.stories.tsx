import * as React from 'react'
import { useInterval } from 'react-use'
import { Tabs } from '@chakra-ui/react'

import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay
} from '../drawer/drawer'
import { rh } from '../rh/rh'

export default {
  title: 'Components / Disclosure / Tabs',
  decorators: [
    (story: any) => (
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
      <Tabs.Root variant={variant} mt="3" defaultValue="settings">
        <Tabs.List>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          <Tabs.Trigger value="billings">Billings</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="settings">Settings</Tabs.Content>
        <Tabs.Content value="billings">Billings</Tabs.Content>
      </Tabs.Root>
    </rh.div>
  ))

const sizes = ['sm', 'md', 'lg'] as const

export const Sizes = () =>
  sizes.map(size => (
    <rh.div key={size} my="10">
      <pre>size = {size}</pre>
      <Tabs.Root size={size} mt="3" defaultValue="settings">
        <Tabs.List>
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
          <Tabs.Trigger value="billings">Billings</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="settings">Settings</Tabs.Content>
        <Tabs.Content value="billings">Billings</Tabs.Content>
      </Tabs.Root>
    </rh.div>
  ))

export const automatic = () => (
  <>
    <p>manual</p>
    <p>manual</p>
    <Tabs.Root defaultValue="settings">
      <Tabs.List>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        <Tabs.Trigger value="billings" disabled>
          Billings
        </Tabs.Trigger>
        <Tabs.Trigger value="preferences" disabled>
          Preferences
        </Tabs.Trigger>
        <Tabs.Trigger value="shutdown">Shut Down</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="settings">Settings</Tabs.Content>
      <Tabs.Content value="billings">Billings</Tabs.Content>
      <Tabs.Content value="preferences">Preferences</Tabs.Content>
      <Tabs.Content value="shutdown">Shut Down</Tabs.Content>
    </Tabs.Root>
    <br />
    <p>auto</p>
    <Tabs.Root defaultValue="settings">
      <Tabs.List>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        <Tabs.Trigger value="billings" disabled>
          Billings
        </Tabs.Trigger>
        <Tabs.Trigger value="preferences" disabled>
          Preferences
        </Tabs.Trigger>
        <Tabs.Trigger value="shutdown">Shut Down</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="settings">Settings</Tabs.Content>
      <Tabs.Content value="billings">Billings</Tabs.Content>
      <Tabs.Content value="preferences">Preferences</Tabs.Content>
      <Tabs.Content value="shutdown">Shut Down</Tabs.Content>
    </Tabs.Root>
  </>
)

export const manual = () => (
  <Tabs.Root defaultValue="settings">
    <Tabs.List>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      <Tabs.Trigger value="billings">Billings</Tabs.Trigger>
      <Tabs.Trigger value="preferences" disabled>
        Preferences
      </Tabs.Trigger>
      <Tabs.Trigger value="shutdown">Shut Down</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="settings">Settings</Tabs.Content>
    <Tabs.Content value="billings">Billings</Tabs.Content>
    <Tabs.Content value="preferences">Preferences</Tabs.Content>
    <Tabs.Content value="shutdown">Shut Down</Tabs.Content>
  </Tabs.Root>
)

export const withIndicator = () => (
  <Tabs.Root variant="plain" defaultValue="settings">
    <Tabs.List>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      <Tabs.Trigger value="billings" disabled>
        Billings
      </Tabs.Trigger>
      <Tabs.Trigger value="preferences">Preferences</Tabs.Trigger>
      <Tabs.Trigger value="shutdown">Shut Down</Tabs.Trigger>
      <Tabs.Indicator mt="-36px" zIndex={-1} height="34px" bg="green.200" />
    </Tabs.List>

    <Tabs.Content value="settings">Settings</Tabs.Content>
    <Tabs.Content value="billings">Billings</Tabs.Content>
    <Tabs.Content value="preferences">Preferences</Tabs.Content>
    <Tabs.Content value="shutdown">Shut Down</Tabs.Content>
  </Tabs.Root>
)

export const withIndicatorAndLongTabText = () => (
  <Tabs.Root variant="plain" defaultValue="long">
    <Tabs.List>
      <Tabs.Trigger value="long">Tab with long text</Tabs.Trigger>
      <Tabs.Trigger value="billings">Billings</Tabs.Trigger>
      <Tabs.Trigger value="preferences">Preferences</Tabs.Trigger>
      <Tabs.Trigger value="shutdown">Shut Down</Tabs.Trigger>
      <Tabs.Indicator mt="-36px" zIndex={-1} height="34px" bg="green.200" />
    </Tabs.List>
    <Tabs.Content value="long">Tab with long text</Tabs.Content>
    <Tabs.Content value="billings">Billings</Tabs.Content>
    <Tabs.Content value="preferences">Preferences</Tabs.Content>
    <Tabs.Content value="shutdown">Shut Down</Tabs.Content>
  </Tabs.Root>
)

export const withVerticalTabs = () => (
  <Tabs.Root orientation="vertical" defaultValue="settings">
    <Tabs.List>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      <Tabs.Trigger value="billings">Billings</Tabs.Trigger>
      <Tabs.Trigger value="preferences" disabled>Preferences</Tabs.Trigger>
      <Tabs.Trigger value="shutdown">Shut Down</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="settings">Settings</Tabs.Content>
    <Tabs.Content value="billings">Billings</Tabs.Content>
    <Tabs.Content value="preferences">Preferences</Tabs.Content>
    <Tabs.Content value="shutdown">Shut Down</Tabs.Content>
  </Tabs.Root>
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
  <Tabs.Root lazyMount defaultValue="1">
    <Tabs.List>
      <Tabs.Trigger value="1">Interval 1</Tabs.Trigger>
      <Tabs.Trigger value="2">Interval 2</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="1">
      Interval 1:
      <Interval />
    </Tabs.Content>
    <Tabs.Content value="2">
      Interval 2:
      <Interval />
    </Tabs.Content>
  </Tabs.Root>
)

export const withLazyTabsMounted = () => (
  <Tabs.Root lazyMount unmountOnExit={false} defaultValue="1">
    <Tabs.List>
      <Tabs.Trigger value="1">Interval 1</Tabs.Trigger>
      <Tabs.Trigger value="2">Interval 2</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="1">
      Interval 1:
      <Interval />
    </Tabs.Content>
    <Tabs.Content value="2">
      Interval 2:
      <Interval />
    </Tabs.Content>
  </Tabs.Root>
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
    // Derive current tab index from id
    const tabIndex = React.useMemo(() => {
      return items.findIndex(x => x.id === selectedItemId)
    }, [items, selectedItemId])

    // Update current selected item id
    const onTabChange = (idx: number) => {
      console.log('onTabChange', idx, items[idx].id)
      const { id } = items[idx]
      setSelectedItemId(id)
    }

    return (
    return (
      <Tabs.Root
        value={selectedItemId}
        onValueChange={(e) => setSelectedItemId(e.value)}
        orientation="vertical"
        variant="enclosed"
      >
        <Tabs.List minW="100px">
          {items.map(x => (
            <Tabs.Trigger key={x.id} value={x.id}>
              {x.id}: {x.value}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        {items.map(x => (
          <Tabs.Content key={x.id} value={x.id}>
            {x.id}: {x.value}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    )
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

  console.log(
    { selectedItemId },
    items.map(x => x.id)
  )

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
  <Drawer open onClose={console.log}>
    <DrawerOverlay>
      <DrawerContent>
        <DrawerBody>
          <Tabs.Root variant="plain" defaultValue="settings">
            <Tabs.List>
              <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
              <Tabs.Trigger value="billings">Billings</Tabs.Trigger>
              <Tabs.Trigger value="preferences">Preferences</Tabs.Trigger>
              <Tabs.Indicator zIndex={-1} height="4px" bg="green.200" />
            </Tabs.List>

            <Tabs.Content value="settings">Settings</Tabs.Content>
            <Tabs.Content value="billings">Billings</Tabs.Content>
            <Tabs.Content value="preferences">Preferences</Tabs.Content>
          </Tabs.Root>
        </DrawerBody>
      </DrawerContent>
    </DrawerOverlay>
  </Drawer>
)

export const WithTabPanelWrapper = () => (
  <Tabs.Root defaultValue="1">
    <Tabs.List>
      <Tabs.Trigger value="1">FIrst Tab</Tabs.Trigger>
      <Tabs.Trigger value="2">Second Tab</Tabs.Trigger>
      <Tabs.Trigger value="3">Third Tab</Tabs.Trigger>
    </Tabs.List>
    <div>
      <Tabs.Content value="1">Tab panel 1</Tabs.Content>
    </div>
    <div>
      <Tabs.Content value="2">Tab panel 2</Tabs.Content>
    </div>
    <div>
      <Tabs.Content value="3">Tab panel 3</Tabs.Content>
    </div>
  </Tabs.Root>
)
