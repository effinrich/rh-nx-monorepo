import { mockConsent, mockRhUser } from '@redesignhealth/portal/data-assets'
import { rest } from 'msw'
import { withRouter } from 'storybook-addon-react-router-v6'

import { Meta } from '@storybook/react'

import SupportPage from './support-page'

const Story: Meta<typeof SupportPage> = {
  component: SupportPage,
  title: 'pages/Support Page',
  decorators: [withRouter],
  parameters: {
    msw: {
      handlers: [
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockRhUser))
        }),
        rest.get('/me/consent/*', (req, res, ctx) => {
          return res(ctx.json(mockConsent))
        })
      ]
    }
  }
}

export default Story

export const Default = {}
