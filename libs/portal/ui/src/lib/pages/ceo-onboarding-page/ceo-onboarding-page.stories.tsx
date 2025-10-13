import { rest } from 'msw'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta, StoryObj } from '@storybook/react'

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
        rest.get('/ceos/6nuT80li', (req, res, ctx) => {
          return res(ctx.json(ceo))
        }),
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(userInfo))
        }),
        rest.get('/person/sazh.katzroy@redesignhealth.com', (req, res, ctx) => {
          return res(ctx.json(person))
        })
      ]
    }
  }
}
