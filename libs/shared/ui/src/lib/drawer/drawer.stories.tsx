import { Meta } from '@storybook/react-vite'

import { DrawerExampleHooks } from './partials/drawer-example-hooks'
import { WithFormHooks } from './partials/with-form-hooks'
import { WithFormLibraryHooks } from './partials/with-form-library-hooks'
import { WithLongContentHooks } from './partials/with-long-content-hooks'
import { WithSizeHooks } from './partials/with-size-hooks'
import { type DrawerRootProps,Drawer } from './drawer'

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

export const DrawerExample = {
  render: (args: DrawerRootProps) => <DrawerExampleHooks {...args} />
}

export const WithForm = {
  render: (args: DrawerRootProps) => <WithFormHooks {...args} />
}

export const WithFormLibrary = {
  render: (args: DrawerRootProps) => <WithFormLibraryHooks {...args} />
}

export const WithSize = {
  render: (args: DrawerRootProps) => <WithSizeHooks {...args} />
}

export const WithLongContent = {
  render: (args: DrawerRootProps) => <WithLongContentHooks {...args} />
}
