import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import { modules } from './mocks/modules'
import { LibraryModulePage } from './library-module-page'

const Story: Meta<typeof LibraryModulePage> = {
  component: LibraryModulePage,
  title: 'pages/LibraryModulePage',
  decorators: [withRouter],
  args: {
    title: 'Module Title',
    helpText: 'Module Description',
    modules: modules
  }
}
export default Story

export const Default = {}
