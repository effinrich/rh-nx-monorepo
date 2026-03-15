import { http, HttpResponse } from 'msw'
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
    http.get('/ip-marketplace', () => HttpResponse.json(response))
  )
}

export const mockGetIpListing = (
  server: SetupServer,
  response: IpMarketplaceSummary
) =>
  server.use(
    http.get('/ip-marketplace/:id', () => HttpResponse.json(response))
  )

export const mockGetIpMarketplaceFilters = (
  server: SetupServer,
  response: Filters
) =>
  server.use(
    http.get('/ip-marketplace/filters', () =>
      HttpResponse.json(response)
    )
  )

export const mockPutMeIpMarketplaceContactInfo = (
  server: SetupServer,
  response: IpMarketplaceRequestContactInfoSummary
) =>
  server.use(
    http.put('/me/ip-marketplace/:id/contact-info', () =>
      HttpResponse.json(response)
    )
  )
