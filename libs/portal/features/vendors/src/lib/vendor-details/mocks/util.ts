import { UserInfoSummary } from '@redesignhealth/portal/data-assets'
import { http, HttpResponse } from 'msw'

import { vendor } from './.'

export const registerMockEndpoints = (user: UserInfoSummary) => [
  http.get('/userinfo', () => {
    return HttpResponse.json(user)
  }),
  http.get('/vendor/123456', () => {
    return HttpResponse.json(vendor)
  })
]
