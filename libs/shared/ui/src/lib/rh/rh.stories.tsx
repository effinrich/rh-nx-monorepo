import { Meta } from '@storybook/react-vite'

import { ApplyPropRh } from './partials/apply-prop-rh'
import { WithColorModeRh } from './partials/with-color-mode-rh'
import { WithCSSVarTokenRh } from './partials/with-css-var-token-rh'
import { WithGradientRh } from './partials/with-gradient-rh'
import { WithHeadingRh } from './partials/with-heading-rh'
import { WithSemanticTokensRh } from './partials/with-semantic-tokens-rh'
import { rh } from './rh'

export default {
  component: rh.div,
  title: 'System / Core'
} as Meta

export const ApplyProp = {
  render: () => <ApplyPropRh />
}

export const WithHeading = {
  render: () => <WithHeadingRh />
}

export const WithGradient = {
  render: () => <WithGradientRh />
}

export const WithCSSVarToken = {
  render: () => <WithCSSVarTokenRh />
}

export const WithSemanticTokens = {
  render: () => <WithSemanticTokensRh />
}

export const WithColorMode = {
  render: () => <WithColorModeRh />
}
