import { mockConsent, mockRhUser } from '@redesignhealth/portal/data-assets'
import { http, HttpResponse } from 'msw'
import { withRouter } from 'storybook-addon-remix-react-router'

import { Meta } from '@storybook/react-vite'

import SupportPage from './support-page'

const Story: Meta<typeof SupportPage> = {
  component: SupportPage,
  title: 'pages/Support Page',
  decorators: [withRouter],
  parameters: {
    msw: {
      handlers: [
        http.get('/userinfo', () => {
          return HttpResponse.json(mockRhUser)
        }),
        http.get('/me/consent/*', () => {
          return HttpResponse.json(mockConsent)
        })
      ]
    }
  }
}

export default Story

export const Default = {}
