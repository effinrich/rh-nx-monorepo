import { Meta } from '@storybook/react-vite'

import { EmptyColorSpinner } from './partials/empty-color-spinner'
import { SizeSpinner } from './partials/size-spinner'
import { SpeedSpinner } from './partials/speed-spinner'
import { WithCustomStyleConfigSpinner } from './partials/with-custom-style-config-spinner'
import { Spinner } from './spinner'

const Story: Meta<typeof Spinner> = {
  component: Spinner,
  title: 'Components / Feedback / Spinner',
  args: {
    color: 'primary'
  }
}
export default Story

export const Basic = {
  render: (args: Record<string, unknown>) => {
    return <Spinner {...args} />
  }
}

export const Size = {
  render: () => <SizeSpinner />
}

export const Speed = {
  render: () => <SpeedSpinner />
}

export const EmptyColor = {
  render: () => <EmptyColorSpinner />
}

export const WithCustomStyleConfig = {
  render: () => <WithCustomStyleConfigSpinner />
}
