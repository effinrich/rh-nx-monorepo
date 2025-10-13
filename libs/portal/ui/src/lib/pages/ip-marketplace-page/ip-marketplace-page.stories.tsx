import {
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockIpListing,
  mockIpListingWithOwner,
  mockIpListingWithRequests,
  mockIpMarketplaceFilters,
  mockIpMarketplaceNoResults
} from '@redesignhealth/portal/data-assets'
import { rest } from 'msw'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react'

import { IPMarketplacePage } from './ip-marketplace-page'

const Story: Meta<typeof IPMarketplacePage> = {
  component: IPMarketplacePage,
  title: 'pages/IP Marketplace Page',
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

export const BuyerOrAdminViewHideAllListings = {
  render: IPMarketplacePage,
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
                mockIpListingWithRequests,
                {
                  ...mockIpListingWithRequests,
                  id: '123abc'
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

export const BuyerOrAdminViewHideOneListing = {
  render: IPMarketplacePage,
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
                mockIpListingWithRequests,
                {
                  ...mockIpListing,
                  id: '123abc'
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

export const BuyerOrAdminNoResults = {
  render: IPMarketplacePage,
  parameters: {
    msw: {
      handlers: [
        ...(Story.parameters?.msw?.handlers ?? null),
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockEnterpriseBuyerUser))
        }),
        rest.get('/ip-marketplace', (req, res, ctx) => {
          return res(ctx.json(mockIpMarketplaceNoResults))
        })
      ]
    }
  }
}

export const SellerViewHideAllListings = {
  render: IPMarketplacePage,
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
                mockIpListingWithOwner,
                {
                  ...mockIpListingWithOwner,
                  id: '123abc'
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

export const SellerViewHideOneListing = {
  render: IPMarketplacePage,
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
                mockIpListingWithOwner,
                {
                  ...mockIpListingWithOwner,
                  id: '123abc',
                  owner: {
                    email: 'sazh.katzroy@redesignhealth.com'
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

export const SellerNoResults = {
  render: IPMarketplacePage,
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
