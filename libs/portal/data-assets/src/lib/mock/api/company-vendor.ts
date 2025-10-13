import { rest } from 'msw'
import { SetupServer } from 'msw/node'

import { CompanyVendor } from '../../vendors'

export const mockGetCompanyVendors = (
  server: SetupServer,
  vendors: CompanyVendor[]
) =>
  server.use(
    rest.get('/company/:companyId/vendor', (req, res, ctx) =>
      res(ctx.json({ content: vendors }))
    )
  )
