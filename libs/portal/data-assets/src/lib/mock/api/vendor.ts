import { http, HttpResponse } from 'msw'
import { SetupServer } from 'msw/node'

import { Vendor } from '../../vendors/types'

export const mockGetVendors = (server: SetupServer, vendors: Vendor[]) => {
  server.use(
    http.get('/vendor', () => HttpResponse.json({ content: vendors }))
  )
  server.use(
    http.get('/vendor/filters', () =>
      HttpResponse.json({
        content: [
          {
            key: 'names',
            options: vendors.map(v => ({ keyword: v.name, count: 1 }))
          }
        ]
      })
    )
  )
}
