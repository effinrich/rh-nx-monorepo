import { http, HttpResponse } from 'msw'
import { SetupServer } from 'msw/node'

import { VendorCategory } from '../../vendors/types'

export const mockGetCategories = (
  server: SetupServer,
  categories: VendorCategory[]
) =>
  server.use(
    http.get('/categories', () => HttpResponse.json(categories))
  )
