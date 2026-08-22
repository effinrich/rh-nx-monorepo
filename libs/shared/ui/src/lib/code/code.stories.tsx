import { Meta } from '@storybook/react-vite'

import { Code } from './code'
import { ColorsCode } from './partials/colors-code'

const Story: Meta<typeof Code> = {
  component: Code,
  title: 'Components / Data Display / Code'
}
export default Story

export const Default = {
  args: {
    children: 'Hello world'
  }
}

export const Colors = {
  render: () => <ColorsCode />
}
