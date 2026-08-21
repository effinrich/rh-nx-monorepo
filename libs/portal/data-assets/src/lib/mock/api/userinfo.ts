import { http, HttpResponse } from 'msw'
import { SetupServer } from 'msw/node'

import { UserInfoSummary } from '../../types'

export const mockGetUserInfo = (server: SetupServer, user: UserInfoSummary) =>
  server.use(http.get('/userinfo', () => HttpResponse.json(user)))
