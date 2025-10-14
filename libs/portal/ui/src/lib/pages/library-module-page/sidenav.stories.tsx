import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import { modules } from './mocks/modules'
import { SideNav } from './sidenav'

const Story: Meta<typeof SideNav> = {
  component: SideNav,
  title: 'Components/SideNav',
  decorators: [withRouter],
  args: {
    modules: modules
  }
}
export default Story

export const Default = {}
