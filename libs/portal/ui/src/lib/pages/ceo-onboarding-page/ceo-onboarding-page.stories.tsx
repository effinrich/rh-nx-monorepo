import { http, HttpResponse } from 'msw'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta, StoryObj } from '@storybook/react-vite'

import CeoDirectoryOnboardingPage from './ceo-onboarding-page'
import { ceo, person, userInfo } from './mocks'

const Story: Meta<typeof CeoDirectoryOnboardingPage> = {
  component: CeoDirectoryOnboardingPage,
  title: 'pages/CEO Onboarding Page',
  decorators: [withRouter],
  args: {}
}

export default Story

export const Default: StoryObj<typeof CeoDirectoryOnboardingPage> = {
  render: () => <CeoDirectoryOnboardingPage />,
  parameters: {
    msw: {
      handlers: [
        http.get('/ceos/6nuT80li', () => {
          return HttpResponse.json(ceo)
        }),
        http.get('/userinfo', () => {
          return HttpResponse.json(userInfo)
        }),
        http.get('/person/sazh.katzroy@redesignhealth.com', () => {
          return HttpResponse.json(person)
        })
      ]
    }
  }
}
