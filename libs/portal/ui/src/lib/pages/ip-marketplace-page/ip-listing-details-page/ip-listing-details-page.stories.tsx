import {
  mockAdminUser,
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockIpListing,
  mockIpListingWithRequests,
  mockIpMarketplaceContactInfo
} from '@redesignhealth/portal/data-assets'
import { rest } from 'msw'
import {
  reactRouterParameters,
  withRouter
} from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react'

import IpListingIpDetails from './ip-listing-ip-details/ip-listing-ip-details'
import IpListingRequests from './ip-listing-requests/ip-listing-requests'
import IpListingDetailsPage from './ip-listing-details-page'

const Story: Meta<typeof IpListingDetailsPage> = {
  component: IpListingDetailsPage,
  title: 'pages/IP Listing Details',
  decorators: [withRouter]
}

export default Story

const reactRouterConfig = reactRouterParameters({
  location: {
    path: '/123456'
  },
  routing: [
    {
      element: <IpListingDetailsPage />,
      path: ':ipListingId',
      children: [
        {
          element: <IpListingIpDetails />,
          path: 'ip-details'
        },
        { element: <IpListingRequests />, path: 'requests' }
      ]
    }
  ]
})

export const SellerView = {
  parameters: {
    reactRouter: reactRouterConfig,
    msw: {
      handlers: [
        rest.get('/ip-marketplace/:id', (req, res, ctx) => {
          return res(ctx.json(mockIpListingWithRequests))
        }),
        rest.get('/userinfo', (req, res, ctx) =>
          res(ctx.json(mockEnterpriseSellerUser))
        )
      ]
    }
  }
}

export const BuyerView = {
  parameters: {
    reactRouter: reactRouterConfig,
    msw: {
      handlers: [
        rest.get('/ip-marketplace/:id', (req, res, ctx) => {
          return res(ctx.json(mockIpListing))
        }),
        rest.get('/userinfo', (req, res, ctx) =>
          res(ctx.json(mockEnterpriseBuyerUser))
        ),
        rest.put('/me/ip-marketplace/:id/contact-info', (req, res, ctx) =>
          res(ctx.json(mockIpMarketplaceContactInfo))
        )
      ]
    }
  }
}

export const AdminView = {
  parameters: {
    reactRouter: reactRouterConfig,
    msw: {
      handlers: [
        rest.get('/ip-marketplace/:id', (req, res, ctx) => {
          return res(ctx.json(mockIpListing))
        }),
        rest.get('/userinfo', (req, res, ctx) => res(ctx.json(mockAdminUser)))
      ]
    }
  }
}
