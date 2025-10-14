/* eslint-disable @typescript-eslint/no-explicit-any */
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import { viewAll } from './mocks/view-all'
import { LibraryPage } from './library-page'

const docs = viewAll

const Story: Meta<typeof LibraryPage> = {
  component: LibraryPage,
  title: 'pages/Library Page',
  decorators: [withRouter],
  args: {
    categoryGroupings: docs
  }
}
export default Story

export const Default = {}
