import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import ButtonRadio from './button-radio'
import { DefaultButtonRadio } from './partials/default-button-radio'

const Story: Meta<typeof ButtonRadio> = {
  component: ButtonRadio,
  title: 'Components / Button Radio',
  decorators: [withRouter],
  args: {}
}

export default Story

export const Default = {
  render: () => <DefaultButtonRadio />
}
