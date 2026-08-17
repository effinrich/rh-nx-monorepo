/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-multi-comp */
/** biome-ignore-all lint/a11y/useButtonType: <explanation> */
import * as React from 'react'
import { useInterval } from 'react-use'
<<<<<<< HEAD
import { Tabs } from '@chakra-ui/react'
import type { storiesOf } from 'storybook'
=======
>>>>>>> origin/main

import {
  DrawerRoot,
  DrawerBody,
  DrawerContent,
  DrawerOverlay
} from '../drawer/drawer'
import { rh } from '../rh/rh'

import { Tab, TabIndicator, TabList, TabPanel, TabsRoot } from './tabs'

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
      <TabsRoot variant={variant} mt="3">
        <TabList>
          <Tab>Settings</Tab>
          <Tab>Billings</Tab>
        </TabList>
        <TabPanel>Settings</TabPanel>
        <TabPanel>Billings</TabPanel>
      </TabsRoot>
    </rh.div>
  ))

const sizes = ['sm', 'md', 'lg'] as const

export const Sizes = () =>
  sizes.map(size => (
    <rh.div key={size} my="10">
      <pre>size = {size}</pre>
      <TabsRoot size={size} mt="3">
        <TabList>
          <Tab>Settings</Tab>
          <Tab>Billings</Tab>
        </TabList>
        <TabPanel>Settings</TabPanel>
        <TabPanel>Billings</TabPanel>
      </TabsRoot>
    </rh.div>
  ))

export const Automatic = () => (
  <>
    <p>manual</p>
    <TabsRoot isManual>
      <TabList>
        <Tab>Settings</Tab>
        <Tab disabled>Billings</Tab>
        <Tab disabled>Preferences</Tab>
        <Tab>Shut Down</Tab>
      </TabList>
      <TabPanel>Settings</TabPanel>
      <TabPanel>Billings</TabPanel>
      <TabPanel>Preferences</TabPanel>
      <TabPanel>Shut Down</TabPanel>
    </TabsRoot>
    <br />
    <p>auto</p>
    <TabsRoot>
      <TabList>
        <Tab>Settings</Tab>
        <Tab disabled>Billings</Tab>
        <Tab disabled>Preferences</Tab>
        <Tab>Shut Down</Tab>
      </TabList>
      <TabPanel>Settings</TabPanel>
      <TabPanel>Billings</TabPanel>
      <TabPanel>Preferences</TabPanel>
      <TabPanel>Shut Down</TabPanel>
    </TabsRoot>
  </>
)

<<<<<<< HEAD
export const Manual = () => (
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

export const WithIndicator = () => (
  <Tabs.Root variant="plain" defaultValue="settings">
    <Tabs.List>
      <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      <Tabs.Trigger value="billings" disabled>
=======
export const manual = () => (
  <TabsRoot isManual>
    <TabList>
      <Tab>Settings</Tab>
      <Tab>Billings</Tab>
      <Tab disabled>Preferences</Tab>
      <Tab>Shut Down</Tab>
    </TabList>
    <TabPanel>Settings</TabPanel>
    <TabPanel>Billings</TabPanel>
    <TabPanel>Preferences</TabPanel>
    <TabPanel>Shut Down</TabPanel>
  </TabsRoot>
)

export const withIndicator = () => (
  <TabsRoot variant="unstyled" isManual>
    <TabList>
      <Tab>Settings</Tab>
      <Tab _disabled={{ color: 'gray.400' }} disabled>
>>>>>>> origin/main
        Billings
      </Tab>
      <Tab>Preferences</Tab>
      <Tab>Shut Down</Tab>
    </TabList>

    <TabIndicator mt="-36px" zIndex={-1} height="34px" bg="green.200" />

    <TabPanel>Settings</TabPanel>
    <TabPanel>Billings</TabPanel>
    <TabPanel>Preferences</TabPanel>
    <TabPanel>Shut Down</TabPanel>
  </TabsRoot>
)

<<<<<<< HEAD
export const WithIndicatorAndLongTabText = () => (
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

export const WithVerticalTabs = () => (
  <Tabs.Root orientation="vertical" defaultValue="settings">
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
=======
export const withIndicatorAndLongTabText = () => (
  <TabsRoot variant="unstyled" isManual>
    <TabList>
      <Tab>Tab with long text</Tab>
      <Tab>Billings</Tab>
      <Tab>Preferences</Tab>
      <Tab>Shut Down</Tab>
    </TabList>
    <TabIndicator mt="-36px" zIndex={-1} height="34px" bg="green.200" />
    <TabPanel>Tab with long text</TabPanel>
    <TabPanel>Billings</TabPanel>
    <TabPanel>Preferences</TabPanel>
    <TabPanel>Shut Down</TabPanel>
  </TabsRoot>
)

export const withVerticalTabs = () => (
  <TabsRoot orientation="vertical">
    <TabList>
      <Tab>Settings</Tab>
      <Tab>Billings</Tab>
      <Tab disabled>Preferences</Tab>
      <Tab>Shut Down</Tab>
    </TabList>
    <TabPanel>Settings</TabPanel>
    <TabPanel>Billings</TabPanel>
    <TabPanel>Preferences</TabPanel>
    <TabPanel>Shut Down</TabPanel>
  </TabsRoot>
>>>>>>> origin/main
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

<<<<<<< HEAD
export const WithLazyTabs = () => (
  <Tabs.Root lazyMount defaultValue="1">
    <Tabs.List>
      <Tabs.Trigger value="1">Interval 1</Tabs.Trigger>
      <Tabs.Trigger value="2">Interval 2</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="1">
=======
export const withLazyTabs = () => (
  <TabsRoot isLazy>
    <TabList>
      <Tab>Interval 1</Tab>
      <Tab>Interval 2</Tab>
    </TabList>
    <TabPanel>
>>>>>>> origin/main
      Interval 1:
      <Interval />
    </TabPanel>
    <TabPanel>
      Interval 2:
      <Interval />
    </TabPanel>
  </TabsRoot>
)

<<<<<<< HEAD
export const WithLazyTabsMounted = () => (
  <Tabs.Root lazyMount unmountOnExit={false} defaultValue="1">
    <Tabs.List>
      <Tabs.Trigger value="1">Interval 1</Tabs.Trigger>
      <Tabs.Trigger value="2">Interval 2</Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="1">
=======
export const withLazyTabsMounted = () => (
  <TabsRoot isLazy lazyBehavior="keepMounted">
    <TabList>
      <Tab>Interval 1</Tab>
      <Tab>Interval 2</Tab>
    </TabList>
    <TabPanel>
>>>>>>> origin/main
      Interval 1:
      <Interval />
    </TabPanel>
    <TabPanel>
      Interval 2:
      <Interval />
    </TabPanel>
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
    // Derive current tab index from id
    const _tabIndex = React.useMemo(() => {
      return items.findIndex(x => x.id === selectedItemId)
    }, [items, selectedItemId])

    // Update current selected item id
    // const onTabChange = (idx: number) => {
    //   // console.log('onTabChange', idx, items[idx].id)
    //   const { id } = items[idx]
    //   setSelectedItemId(id)
    // }

    return (
<<<<<<< HEAD
      <Tabs.Root
        value={selectedItemId}
        onValueChange={e => setSelectedItemId(e.value)}
=======
      <TabsRoot
        index={tabIndex}
        onChange={onTabChange}
>>>>>>> origin/main
        orientation="vertical"
        variant="enclosed-colored"
      >
        <TabList minW="100px">
          {items.map(x => (
            <Tab key={x.id}>
              {x.id}: {x.value}
            </Tab>
          ))}
        </TabList>
        {items.map(x => (
          <TabPanel key={x.id}>
            {x.id}: {x.value}
          </TabPanel>
        ))}
<<<<<<< HEAD
      </Tabs.Root>
=======
      </TabsRoot>
>>>>>>> origin/main
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

<<<<<<< HEAD
export const WithinDrawer = () => (
  <Drawer open>
=======
export const withinDrawer = () => (
  <DrawerRoot open onOpenChange={console.log}>
>>>>>>> origin/main
    <DrawerOverlay>
      <DrawerContent>
        <DrawerBody>
          <TabsRoot variant="unstyled" isManual>
            <TabList>
              <Tab>Settings</Tab>
              <Tab>Billings</Tab>
              <Tab>Preferences</Tab>
            </TabList>

            <TabIndicator zIndex={-1} height="4px" bg="green.200" />

            <TabPanel>Settings</TabPanel>
            <TabPanel>Billings</TabPanel>
            <TabPanel>Preferences</TabPanel>
          </TabsRoot>
        </DrawerBody>
      </DrawerContent>
    </DrawerOverlay>
  </DrawerRoot>
)

export const WithTabPanelWrapper = () => (
  <TabsRoot>
    <TabList>
      <Tab>FIrst Tab</Tab>
      <Tab>Second Tab</Tab>
      <Tab>Third Tab</Tab>
    </TabList>
    <div>
      <TabPanel>Tab panel 1</TabPanel>
    </div>
    <div>
      <TabPanel>Tab panel 2</TabPanel>
    </div>
    <div>
      <TabPanel>Tab panel 3</TabPanel>
    </div>
  </TabsRoot>
)
