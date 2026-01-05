import { create } from '@storybook/theming'

import brandImage from './RH_Logo_Single_Ultraviolet.png'

export default create({
  base: 'light',
  colorPrimary: '#B540EC',
  colorSecondary: '#9425C9',
  brandTitle: 'Redesign Health',
  brandUrl: 'https://github.com/redesignhealth/rh-design-system',
  brandImage: brandImage
})
