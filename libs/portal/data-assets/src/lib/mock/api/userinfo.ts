import { rest } from 'msw'
import { SetupServer } from 'msw/lib/node'

import { UserInfoSummary } from '../../types'

export const mockGetUserInfo = (server: SetupServer, user: UserInfoSummary) =>
  server.use(rest.get('/userinfo', (req, res, ctx) => res(ctx.json(user))))
