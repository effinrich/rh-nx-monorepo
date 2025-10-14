import {
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockIpListing,
  mockIpListingWithReleasedIPRequest,
  mockIpListingWithRequests,
  mockIpListingWithUnreleasedIPRequest,
  mockIpMarketplaceFilters,
  mockIpMarketplaceNoResults
} from '@redesignhealth/portal/data-assets'
import { rest } from 'msw'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import { MyRequestsPage } from './my-requests'

const Story: Meta<typeof MyRequestsPage> = {
  component: MyRequestsPage,
  title: 'pages/My Requests Page',
  decorators: [withRouter],
  args: {},
  parameters: {
    msw: {
      handlers: [
        rest.get('/ip-marketplace/filters', (req, res, ctx) => {
          return res(ctx.json(mockIpMarketplaceFilters))
        })
      ]
    }
  }
}

export default Story

export const BuyerView = {
  render: MyRequestsPage,
  parameters: {
    msw: {
      handlers: [
        ...(Story.parameters?.msw?.handlers ?? null),
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockEnterpriseBuyerUser))
        }),
        rest.get('/ip-marketplace', (req, res, ctx) => {
          return res(
            ctx.json({
              content: [
                mockIpListing,
                { ...mockIpListingWithReleasedIPRequest, id: '123abc' },
                { ...mockIpListingWithUnreleasedIPRequest, id: '456abc' }
              ],
              page: {
                size: 1000,
                totalElements: 2,
                totalPages: 1,
                number: 0
              }
            })
          )
        })
      ]
    }
  }
}

export const SellerView = {
  render: MyRequestsPage,
  parameters: {
    msw: {
      handlers: [
        ...(Story.parameters?.msw?.handlers ?? null),
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockEnterpriseSellerUser))
        }),
        rest.get('/ip-marketplace', (req, res, ctx) => {
          return res(
            ctx.json({
              content: [
                {
                  ...mockIpListingWithReleasedIPRequest,
                  owner: {
                    email: 'lighting.mcfaron@example.com'
                  },
                  metrics: {
                    viewCount: 10,
                    requestCount: 1
                  }
                }, // this will not be shown because owner does not match
                {
                  ...mockIpListingWithReleasedIPRequest,
                  id: '123abc',
                  owner: {
                    email: 'sazh.katzroy@redesignhealth.com'
                  },
                  metrics: {
                    viewCount: 21,
                    requestCount: 1
                  }
                },
                {
                  ...mockIpListingWithUnreleasedIPRequest,
                  id: '456abc',
                  owner: {
                    email: 'sazh.katzroy@redesignhealth.com'
                  },
                  metrics: {
                    viewCount: 5,
                    requestCount: 1
                  }
                },
                {
                  ...mockIpListingWithRequests,
                  id: '789abc',
                  name: 'Marvelous Idea with Multiple Buyer Requests',
                  owner: {
                    email: 'sazh.katzroy@redesignhealth.com'
                  },
                  metrics: {
                    viewCount: 300,
                    requestCount: 3
                  }
                }
              ],
              page: {
                size: 1000,
                totalElements: 2,
                totalPages: 1,
                number: 0
              }
            })
          )
        })
      ]
    }
  }
}

export const NoResults = {
  render: MyRequestsPage,
  parameters: {
    msw: {
      handlers: [
        ...(Story.parameters?.msw?.handlers ?? null),
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockEnterpriseSellerUser))
        }),
        rest.get('/ip-marketplace', (req, res, ctx) => {
          return res(ctx.json(mockIpMarketplaceNoResults))
        })
      ]
    }
  }
}
