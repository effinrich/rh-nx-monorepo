import { Meta } from '@storybook/react-vite'

import { Container } from '../container/container'

import { BasicAlert } from './partials/basic-alert'
import { DocsExampleAlert } from './partials/docs-example-alert'
import { LeftAccentAlert } from './partials/left-accent-alert'
import { LoadingExampleAlert } from './partials/loading-example-alert'
import { SubtleAlert } from './partials/subtle-alert'
import { TopAccentAlert } from './partials/top-accent-alert'
import { WarningExampleAlert } from './partials/warning-example-alert'
import { AlertRoot } from './alert'

export default {
  component: AlertRoot,
  title: 'Components / Feedback / Alert',
  decorators: [
    (story: () => unknown) => <Container mt={4}>{story()}</Container>
  ]
} as Meta<typeof AlertRoot>

export const Basic = {
  render: () => <BasicAlert />
}

export const Subtle = {
  render: () => <SubtleAlert />
}

export const LeftAccent = {
  render: () => <LeftAccentAlert />
}

export const TopAccent = {
  render: () => <TopAccentAlert />
}

export const DocsExample = {
  render: () => <DocsExampleAlert />
}

export const LoadingExample = {
  render: () => <LoadingExampleAlert />
}

export const WarningExample = {
  render: () => <WarningExampleAlert />
}
