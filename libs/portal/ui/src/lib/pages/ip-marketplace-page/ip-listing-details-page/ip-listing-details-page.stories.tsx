import {
  mockAdminUser,
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockIpListing,
  mockIpListingWithRequests,
  mockIpMarketplaceContactInfo
} from '@redesignhealth/portal/data-assets'
import { http, HttpResponse } from 'msw'
import {
  reactRouterParameters,
  withRouter
} from 'storybook-addon-remix-react-router'

import type { Meta } from '@storybook/react-vite'

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
        http.get('/ip-marketplace/:id', () => {
          return HttpResponse.json(mockIpListingWithRequests)
        }),
        http.get('/userinfo', () => HttpResponse.json(mockEnterpriseSellerUser))
      ]
    }
  }
}

export const BuyerView = {
  parameters: {
    reactRouter: reactRouterConfig,
    msw: {
      handlers: [
        http.get('/ip-marketplace/:id', () => {
          return HttpResponse.json(mockIpListing)
        }),
        http.get('/userinfo', () => HttpResponse.json(mockEnterpriseBuyerUser)),
        http.put('/me/ip-marketplace/:id/contact-info', () =>
          HttpResponse.json(mockIpMarketplaceContactInfo)
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
        http.get('/ip-marketplace/:id', () => {
          return HttpResponse.json(mockIpListing)
        }),
        http.get('/userinfo', () => HttpResponse.json(mockAdminUser))
      ]
    }
  }
}
