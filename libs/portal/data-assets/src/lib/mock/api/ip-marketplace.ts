import { rest } from 'msw'
import { SetupServer } from 'msw/node'

import {
  IpMarketplaceRequestContactInfoSummary,
  IpMarketplaceSummary
} from '../../ip/types'
import { Filters, PagedResult } from '../../types'

export const mockGetIpMarketplace = (
  server: SetupServer,
  ipListings: IpMarketplaceSummary[]
) => {
  const response: PagedResult<IpMarketplaceSummary> = {
    content: ipListings,
    page: {
      size: 1000,
      totalElements: ipListings.length,
      totalPages: 1,
      number: 0
    },
    links: []
  }
  return server.use(
    rest.get('/ip-marketplace', (req, res, ctx) => res(ctx.json(response)))
  )
}

export const mockGetIpListing = (
  server: SetupServer,
  response: IpMarketplaceSummary
) =>
  server.use(
    rest.get('/ip-marketplace/:id', (req, res, ctx) => res(ctx.json(response)))
  )

export const mockGetIpMarketplaceFilters = (
  server: SetupServer,
  response: Filters
) =>
  server.use(
    rest.get('/ip-marketplace/filters', (req, res, ctx) =>
      res(ctx.json(response))
    )
  )

export const mockPutMeIpMarketplaceContactInfo = (
  server: SetupServer,
  response: IpMarketplaceRequestContactInfoSummary
) =>
  server.use(
    rest.put('/me/ip-marketplace/:id/contact-info', (req, res, ctx) =>
      res(ctx.json(response))
    )
  )
