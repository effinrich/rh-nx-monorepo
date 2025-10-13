import { rest } from 'msw'
import { SetupServer } from 'msw/node'

import { VendorCategory } from '../../vendors/types'

export const mockGetCategories = (
  server: SetupServer,
  categories: VendorCategory[]
) =>
  server.use(
    rest.get('/categories', (req, res, ctx) => res(ctx.json(categories)))
  )
