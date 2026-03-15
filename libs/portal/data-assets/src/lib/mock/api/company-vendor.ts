import { http, HttpResponse } from 'msw'
import { SetupServer } from 'msw/node'

import { CompanyVendor } from '../../vendors'

export const mockGetCompanyVendors = (
  server: SetupServer,
  vendors: CompanyVendor[]
) =>
  server.use(
    http.get('/company/:companyId/vendor', () =>
      HttpResponse.json({ content: vendors })
    )
  )
