import { Meta } from '@storybook/react-vite'

import { Logo } from './logo'
import { CustomColorLogo } from './partials/custom-color-logo'
import { CustomSizeLogo } from './partials/custom-size-logo'
import { OnColoredBackgroundLogo } from './partials/on-colored-background-logo'
import { OnDarkBackgroundLogo } from './partials/on-dark-background-logo'
import { ResponsiveLogo } from './partials/responsive-logo'
import { WithPrismIconLogo } from './partials/with-prism-icon-logo'

export default {
  component: Logo,
  title: 'Components / Media / Logo'
} as Meta<typeof Logo>

export const Default = {
  args: {}
}

export const CustomSize = {
  render: () => <CustomSizeLogo />
}

export const CustomColor = {
  render: () => <CustomColorLogo />
}

export const OnDarkBackground = {
  render: () => <OnDarkBackgroundLogo />
}

export const OnColoredBackground = {
  render: () => <OnColoredBackgroundLogo />
}

export const WithPrismIcon = {
  render: () => <WithPrismIconLogo />
}

export const Responsive = {
  render: () => <ResponsiveLogo />
}
