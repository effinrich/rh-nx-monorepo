import { rest } from 'msw'
import { SetupServer } from 'msw/node'

import { Vendor } from '../../vendors/types'

export const mockGetVendors = (server: SetupServer, vendors: Vendor[]) => {
  server.use(
    rest.get('/vendor', (req, res, ctx) => res(ctx.json({ content: vendors })))
  )
  server.use(
    rest.get('/vendor/filters', (req, res, ctx) =>
      res(
        ctx.json({
          content: [
            {
              key: 'names',
              options: vendors.map(v => ({ keyword: v.name, count: 1 }))
            }
          ]
        })
      )
    )
  )
}
