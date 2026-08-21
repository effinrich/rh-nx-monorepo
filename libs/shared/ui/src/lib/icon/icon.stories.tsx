import { MdOutline3dRotation } from 'react-icons/md'

import { Meta } from '@storybook/react-vite'

import { ArrowIcon } from './partials/arrow-icon'
import { HeartIcon } from './partials/heart-icon'
import { Icon } from './icon'

export default {
  title: 'Components / Media & Icons / Icon',
  component: Icon
} as Meta<typeof Icon>

export const Basic = {
  render: () => <Icon fontSize="24px" />
}

export const CustomIcon = {
  render: () => <ArrowIcon boxSize="40px" color="red.100" />
}

export const UsingReactIcon = {
  render: () => (
    <Icon as={MdOutline3dRotation} boxSize="40px" color="tomato" />
  )
}

export const UsingCreateIcon = {
  render: () => <HeartIcon boxSize="40px" />
}
