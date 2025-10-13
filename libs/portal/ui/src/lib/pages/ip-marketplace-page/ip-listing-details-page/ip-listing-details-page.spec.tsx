import {
  mockAdminUser,
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockGetIpListing,
  mockGetUserInfo,
  mockIpListing,
  mockIpListingWithMetrics,
  mockIpListingWithRequests,
  mockIpMarketplaceContactInfo,
  mockPutMeIpMarketplaceContactInfo
} from '@redesignhealth/portal/data-assets'
import {
  fireEvent,
  render,
  screen,
  waitForLoadingToFinish
} from '@redesignhealth/shared-utils-jest'
import { waitForElementToBeRemoved } from '@testing-library/react'
import { setupServer } from 'msw/node'

import IpListingDetailsPage from './ip-listing-details-page'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    ipListingId: '6nuT80li'
  }),
  useNavigate: () => jest.fn()
}))

describe('IpListingDetailsPage', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  beforeEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Metrics', () => {
    beforeEach(() => mockGetUserInfo(server, mockEnterpriseSellerUser))
    it('renders metrics when provided', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        metrics: {
          viewCount: 20,
          requestCount: 10
        }
      })
      render(<IpListingDetailsPage />)
      expect(
        (await screen.findByTestId('ip-metric-view-count')).textContent
      ).toBe('Views: 20')
      expect(
        (await screen.findByTestId('ip-metric-request-count')).textContent
      ).toBe('Requests: 10')
    })

    it('hides metrics when omitted', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        metrics: undefined
      })
      render(<IpListingDetailsPage />)
      await waitForLoadingToFinish()
      expect(screen.queryByText('Views:')).not.toBeInTheDocument()
      expect(screen.queryByText('Requests:')).not.toBeInTheDocument()
    })
  })
  describe('Request Contact Flow', () => {
    it('renders for a marketplace buyer', async () => {
      mockGetUserInfo(server, mockEnterpriseBuyerUser)
      mockGetIpListing(server, mockIpListing)
      render(<IpListingDetailsPage />)
      expect(
        await screen.findByText('Request contact info')
      ).toBeInTheDocument()
    })

    it('does not render for a marketplace seller', async () => {
      mockGetUserInfo(server, mockEnterpriseSellerUser)
      mockGetIpListing(server, mockIpListing)
      render(<IpListingDetailsPage />)
      await waitForLoadingToFinish()
      expect(screen.queryByText('Request contact info')).not.toBeInTheDocument()
    })

    it('does not render for an admin', async () => {
      mockGetUserInfo(server, mockAdminUser)
      mockGetIpListing(server, mockIpListing)
      render(<IpListingDetailsPage />)
      await waitForLoadingToFinish()
      expect(screen.queryByText('Request contact info')).not.toBeInTheDocument()
    })

    it('shows placeholder if already requested', async () => {
      mockGetUserInfo(server, mockEnterpriseBuyerUser)
      mockGetIpListing(server, mockIpListingWithRequests)
      render(<IpListingDetailsPage />)
      expect(
        await screen.findByText('Contact info requested')
      ).toBeInTheDocument()
    })

    it('renders disclaimer when clicked and shows success message', async () => {
      mockGetUserInfo(server, mockEnterpriseBuyerUser)
      mockGetIpListing(server, mockIpListing)
      mockPutMeIpMarketplaceContactInfo(server, mockIpMarketplaceContactInfo)
      render(<IpListingDetailsPage />)

      fireEvent.click(
        await screen.findByRole('button', { name: 'Request contact info' })
      )
      expect(
        screen.getByText(
          'Disclaimer about the release of seller contact information'
        )
      )
      fireEvent.click(
        await screen.findByRole('button', { name: 'Accept & send request' })
      )
      expect(await screen.findByText('Request sent successfully'))
      fireEvent.click(await screen.findByRole('button', { name: 'Got it' }))
      await waitForElementToBeRemoved(screen.queryByRole('dialog'))
    })
  })
})
