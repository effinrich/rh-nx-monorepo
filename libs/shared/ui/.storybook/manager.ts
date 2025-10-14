import { addons } from '@storybook/addons'
import { create } from 'storybook/theming'

import Logo from '../src/lib/assets/RH_Logo_Single_Ultraviolet.png'

const storybookTheme = create({
  base: 'light',
  colorPrimary: '#B540EC',
  colorSecondary: '#9425C9',
  brandTitle: 'Redesign Health',
  brandUrl: 'https://github.com/redesignhealth/rh-design-system',
  brandImage: Logo
})

addons.setConfig({
  theme: storybookTheme
})
