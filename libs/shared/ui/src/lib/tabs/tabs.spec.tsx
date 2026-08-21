import type { ComponentProps } from 'react'
import {
  render,
  screen,
  testA11y
} from '@redesignhealth/shared-utils-jest'

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from './tabs'

const ThreeTabs = (props: ComponentProps<typeof TabsRoot>) => (
  <TabsRoot defaultValue="1" {...props}>
    <TabsList>
      <TabsTrigger value="1">Tab 1</TabsTrigger>
      <TabsTrigger value="2">Tab 2</TabsTrigger>
      <TabsTrigger value="3">Tab 3</TabsTrigger>
    </TabsList>
    <TabsContent value="1">
      <p>Panel 1</p>
    </TabsContent>
    <TabsContent value="2">
      <p>Panel 2</p>
    </TabsContent>
    <TabsContent value="3">
      <p>Panel 3</p>
    </TabsContent>
  </TabsRoot>
)

describe('Tabs', () => {
  test('should no accessibility issues', async () => {
    await testA11y(<ThreeTabs />)
  })

  test('selects the correct tab on click', async () => {
    const { user } = render(<ThreeTabs />)

    const tab1 = screen.getByText('Tab 1')
    const panel1 = screen.getByText('Panel 1')
    const tab2 = screen.getByText('Tab 2')
    const panel2 = screen.getByText('Panel 2')

    expect(tab1).toHaveAttribute('aria-selected', 'true')
    expect(panel1).toBeVisible()

    await user.click(tab2)

    expect(tab2).toHaveAttribute('aria-selected', 'true')
    expect(panel2).toBeVisible()
  })

  test('renders only the currently active tab panel if lazyMount', async () => {
    const { user } = render(
      <TabsRoot defaultValue="1" lazyMount>
        <TabsList>
          <TabsTrigger value="1">Tab 1</TabsTrigger>
          <TabsTrigger value="2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <p>Panel 1</p>
        </TabsContent>
        <TabsContent value="2">
          <p>Panel 2</p>
        </TabsContent>
      </TabsRoot>
    )

    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.queryByText('Panel 2')).not.toBeInTheDocument()

    await user.click(screen.getByText('Tab 2'))

    expect(screen.getByText('Panel 2')).toBeInTheDocument()
  })

  test('renders the currently active tab panel and previously-selected tabs if lazyMount without unmountOnExit', async () => {
    const { user } = render(
      <TabsRoot defaultValue="1" lazyMount>
        <TabsList>
          <TabsTrigger value="1">Tab 1</TabsTrigger>
          <TabsTrigger value="2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="1">
          <p>Panel 1</p>
        </TabsContent>
        <TabsContent value="2">
          <p>Panel 2</p>
        </TabsContent>
      </TabsRoot>
    )

    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.queryByText('Panel 2')).not.toBeInTheDocument()

    await user.click(screen.getByText('Tab 2'))

    expect(screen.getByText('Panel 1')).toBeInTheDocument()
    expect(screen.getByText('Panel 2')).toBeInTheDocument()
  })
})
