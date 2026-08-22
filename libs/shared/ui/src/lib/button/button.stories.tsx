import { ReactNode } from 'react'
import { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button'
import { ButtonWithIconButton } from './partials/button-with-icon-button'
import { CustomCompositionButton } from './partials/custom-composition-button'
import { WithAttachedButtonsButton } from './partials/with-attached-buttons-button'
import { WithButtonGroupButton } from './partials/with-button-group-button'
import { WithColorsButton } from './partials/with-colors-button'
import { WithCustomLoadingStateButton } from './partials/with-custom-loading-state-button'
import { WithDisabledButton } from './partials/with-disabled-button'
import { WithIconButton } from './partials/with-icon-button'
import { WithLoadingSpinnerPlacementButton } from './partials/with-loading-spinner-placement-button'
import { WithLoadingStateButton } from './partials/with-loading-state-button'
import { WithReactIconsButton } from './partials/with-react-icons-button'
import { WithSizesButton } from './partials/with-sizes-button'
import { WithSocialButtonButton } from './partials/with-social-button-button'
import { WithVariantsButton } from './partials/with-variants-button'

export default {
  component: Button,
  title: 'Components / Forms / Button',
  argTypes: {
    iconSpacing: { type: 'string' },
    children: { type: 'string' },
    loadingText: { type: 'string' },
    isActive: { type: 'boolean' },
    isDisabled: { type: 'boolean' },
    isLoading: { type: 'boolean' },
    leftIcon: { type: 'function' },
    rightIcon: { type: 'function' },
    'aria-label': { type: 'string' },
    variant: {
      options: ['solid', 'outline', 'ghost', 'link', 'unstyled'],
      control: { type: 'radio' }
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'radio' }
    },
    spinnerPlacement: {
      options: ['end', 'start'],
      control: { type: 'radio' }
    },
    colorPalette: {
      options: [
        'primary',
        'blackAlpha',
        'gray',
        'red',
        'orange',
        'green',
        'facebook',
        'teal'
      ],
      control: { type: 'select' }
    }
  },
  args: {
    'aria-label': 'button action',
    colorPalette: 'primary',
    size: 'md',
    variant: 'solid'
  }
} as Meta<typeof Button>

interface StoryProps {
  children?: ReactNode
  colorScheme?: string
  variant?: string
  size?: string
}

export const Basic: StoryObj<StoryProps> = {
  args: {
    children: 'Button',
    colorPalette: 'primary',
    variant: 'solid'
  }
}

export const Outlines: StoryObj<StoryProps> = {
  render: props => (
    <>
      <Button {...props} variant="outline" colorPalette="red" />
      <Button {...props} variant="outline" colorPalette="green" />
      <Button {...props} variant="outline" colorPalette="blue" />
      <Button {...props} variant="outline" colorPalette="teal" />
      <Button {...props} variant="outline" colorPalette="pink" />
      <Button {...props} variant="outline" colorPalette="purple" />
      <Button {...props} variant="outline" colorPalette="cyan" />
      <Button {...props} variant="outline" colorPalette="orange" />
      <Button {...props} variant="outline" colorPalette="yellow" />
      <Button {...props} variant="outline" colorPalette="zap" />
    </>
  ),

  argTypes: {
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: { type: 'radio' }
    }
  },

  args: {
    children: 'Button'
  }
}

export const WithVariants = {
  render: () => <WithVariantsButton />
}

export const WithColors = {
  render: () => <WithColorsButton />
}

export const WithSizes = {
  render: () => <WithSizesButton />
}

export const WithIcon = {
  render: () => <WithIconButton />
}

export const WithReactIcons = {
  render: () => <WithReactIconsButton />
}

export const WithLoadingState = {
  render: () => <WithLoadingStateButton />
}

export const WithCustomLoadingState = {
  render: () => <WithCustomLoadingStateButton />
}

export const WithLoadingSpinnerPlacement = {
  render: () => <WithLoadingSpinnerPlacementButton />
}

export const WithDisabled = {
  render: () => <WithDisabledButton />
}

export const CustomComposition = {
  render: () => <CustomCompositionButton />
}

export const ButtonWithIcon = {
  render: () => <ButtonWithIconButton />
}

export const WithButtonGroup = {
  render: () => <WithButtonGroupButton />
}

export const WithAttachedButtons = {
  render: () => <WithAttachedButtonsButton />
}

export const WithSocialButton = {
  render: () => <WithSocialButtonButton />
}
