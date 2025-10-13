import { UserInfoSummary } from '@redesignhealth/portal/data-assets'
import { rest } from 'msw'

import { vendor } from './.'

export const registerMockEndpoints = (user: UserInfoSummary) => [
  rest.get('/userinfo', (req, res, ctx) => {
    return res(ctx.json(user))
  }),
  rest.get('/vendor/123456', (req, res, ctx) => {
    return res(ctx.json(vendor))
  })
]
