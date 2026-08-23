import type { Meta, StoryObj } from '@storybook/react-vite'

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
import { Button } from './button'

const meta = {
  component: Button,
  title: 'Components / Forms / Button',
  argTypes: {
    children: { control: 'text' },
    loadingText: { control: 'text' },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    unstyled: { control: 'boolean' },
    spinner: { control: false },
    'aria-label': { control: 'text' },
    variant: {
      options: ['solid', 'subtle', 'surface', 'outline', 'ghost', 'plain'],
      control: { type: 'radio' }
    },
    size: {
      options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
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
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {
    children: 'Button',
    colorPalette: 'primary',
    variant: 'solid'
  }
}

export const Outlines: Story = {
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
      options: ['2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl'],
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
