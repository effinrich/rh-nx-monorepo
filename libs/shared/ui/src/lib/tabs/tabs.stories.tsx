import { Meta } from '@storybook/react-vite'

import { rh } from '../rh/rh'

import { AutomaticTabs } from './partials/automatic-tabs'
import { ManualTabs } from './partials/manual-tabs'
import { SizesTabs } from './partials/sizes-tabs'
import { VariantsTabs } from './partials/variants-tabs'
import { WithIndicatorAndLongTabTextTabs } from './partials/with-indicator-and-long-tab-text-tabs'
import { WithIndicatorTabs } from './partials/with-indicator-tabs'
import { WithLazyTabs } from './partials/with-lazy-tabs'
import { WithLazyTabsMounted } from './partials/with-lazy-tabs-mounted'
import { WithSwappedTabs as WithSwappedTabsExample } from './partials/with-swapped-tabs'
import { WithTabPanelWrapperTabs } from './partials/with-tab-panel-wrapper-tabs'
import { WithVerticalTabs } from './partials/with-vertical-tabs'
import { WithinDrawerTabs } from './partials/within-drawer-tabs'
import { TabsRoot } from './tabs'

export default {
  component: TabsRoot,
  title: 'Components / Disclosure / Tabs',
  decorators: [
    (story: () => unknown) => (
      <rh.div maxWidth="500px" mt="100px" mx="auto">
        {story()}
      </rh.div>
    )
  ]
} as Meta<typeof TabsRoot>

export const Variants = {
  render: () => <VariantsTabs />
}

export const Sizes = {
  render: () => <SizesTabs />
}

export const Automatic = {
  render: () => <AutomaticTabs />
}

export const manual = {
  render: () => <ManualTabs />
}

export const withIndicator = {
  render: () => <WithIndicatorTabs />
}

export const withIndicatorAndLongTabText = {
  render: () => <WithIndicatorAndLongTabTextTabs />
}

export const withVerticalTabs = {
  render: () => <WithVerticalTabs />
}

export const withLazyTabs = {
  render: () => <WithLazyTabs />
}

export const withLazyTabsMounted = {
  render: () => <WithLazyTabsMounted />
}

export const WithSwappedTabs = {
  render: () => <WithSwappedTabsExample />
}

export const withinDrawer = {
  render: () => <WithinDrawerTabs />
}

export const WithTabPanelWrapper = {
  render: () => <WithTabPanelWrapperTabs />
}
