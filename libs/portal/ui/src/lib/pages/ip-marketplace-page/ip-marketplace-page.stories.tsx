import {
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockIpListing,
  mockIpListingWithOwner,
  mockIpListingWithRequests,
  mockIpMarketplaceFilters,
  mockIpMarketplaceNoResults
} from '@redesignhealth/portal/data-assets'
import { http, HttpResponse } from 'msw'
import { withRouter } from 'storybook-addon-remix-react-router'

import type { Meta } from '@storybook/react-vite'

import { IPMarketplacePage } from './ip-marketplace-page'

const Story: Meta<typeof IPMarketplacePage> = {
  component: IPMarketplacePage,
  title: 'pages/IP Marketplace Page',
  decorators: [withRouter],
  args: {},
  parameters: {
    msw: {
      handlers: [
        http.get('/ip-marketplace/filters', () => {
          return HttpResponse.json(mockIpMarketplaceFilters)
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockEnterpriseBuyerUser)
        }),
        http.get('/ip-marketplace', () => {
          return HttpResponse.json({
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockEnterpriseBuyerUser)
        }),
        http.get('/ip-marketplace', () => {
          return HttpResponse.json({
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockEnterpriseBuyerUser)
        }),
        http.get('/ip-marketplace', () => {
          return HttpResponse.json(mockIpMarketplaceNoResults)
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockEnterpriseSellerUser)
        }),
        http.get('/ip-marketplace', () => {
          return HttpResponse.json({
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockEnterpriseSellerUser)
        }),
        http.get('/ip-marketplace', () => {
          return HttpResponse.json({
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockEnterpriseSellerUser)
        }),
        http.get('/ip-marketplace', () => {
          return HttpResponse.json(mockIpMarketplaceNoResults)
        })
      ]
    }
  }
}
