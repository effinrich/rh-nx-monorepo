import {
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockGetIpMarketplace,
  mockGetIpMarketplaceFilters,
  mockGetUserInfo,
  mockIpListing,
  mockIpListingWithReleasedIPRequest,
  mockIpListingWithRequests,
  mockIpListingWithUnreleasedIPRequest,
  mockIpMarketplaceContactInfo,
  mockIpMarketplaceFilters,
  mockPutMeIpMarketplaceContactInfo
} from '@redesignhealth/portal/data-assets'
import {
  fireEvent,
  mocks,
  render,
  screen
} from '@redesignhealth/shared-utils-jest'
import { within } from '@testing-library/react'
import { waitForElementToBeRemoved } from '@testing-library/react'
import { setupServer } from 'msw/node'

import MyRequestsPage from './my-requests'

describe('My Requests Page', () => {
  mocks.matchMedia('any', false)

  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  beforeEach(() =>
    mockGetIpMarketplaceFilters(server, mockIpMarketplaceFilters)
  )
  beforeEach(() => mockGetUserInfo(server, mockEnterpriseBuyerUser))

  describe('No results', () => {
    beforeEach(() => mockGetIpMarketplace(server, []))

    it('shows no requests found when there are no requested IPs', async () => {
      render(<MyRequestsPage />)
      expect(await screen.findByText('No requests found')).toBeInTheDocument()
    })
  })

  describe('Buyer', () => {
    beforeEach(() => mockGetUserInfo(server, mockEnterpriseBuyerUser))

    beforeEach(() =>
      mockGetIpMarketplace(server, [
        mockIpListing,
        { ...mockIpListingWithReleasedIPRequest, id: '123abc' },
        { ...mockIpListingWithUnreleasedIPRequest, id: '456abc' }
      ])
    )

    it('Shows one seller with released info, one seller with unreleased info, and does not show one IP that I did not request', async () => {
      render(<MyRequestsPage />)
      expect(await screen.findAllByText('Marvelous Idea')).toHaveLength(2)
      expect(screen.getAllByLabelText('Seller')).toHaveLength(2)
      expect(screen.getAllByLabelText('Details of request')).toHaveLength(2)
      expect(screen.getAllByText('Requested on: 11/01/2023')).toHaveLength(2)

      // unreleased info
      expect(screen.getByText('Someone at Ever/body')).toBeInTheDocument()
      expect(
        screen.getByText('Released on: Not released yet')
      ).toBeInTheDocument()

      // released info
      expect(screen.getByText('Lighting McFaron')).toBeInTheDocument()
      expect(
        screen.getByText('lighting.mcfaron@example.com')
      ).toBeInTheDocument()
      expect(screen.getByText('Released on: 11/02/2023')).toBeInTheDocument()
    })
    it('does not render metrics since none should be returned by the API for Buyer', async () => {
      render(<MyRequestsPage />)

      expect(
        screen.queryByTestId('ip-metric-view-count')
      ).not.toBeInTheDocument()
      expect(
        screen.queryByTestId('ip-metric-requests-count')
      ).not.toBeInTheDocument()
    })
  })

  describe('Seller', () => {
    beforeEach(() => mockGetUserInfo(server, mockEnterpriseSellerUser))
    beforeEach(() =>
      mockGetIpMarketplace(server, [
        // seller will see owner if it's the same org. will also see metrics
        {
          ...mockIpListingWithReleasedIPRequest,
          owner: {
            email: 'lighting.mcfaron@example.com'
          },
          metrics: {
            viewCount: 10,
            requestCount: 1
          }
        },
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
        }
      ])
    )

    it('shows one buyer with released info, one buyer with unreleased info, and does not show IP that is not mine', async () => {
      render(<MyRequestsPage />)
      expect(await screen.findAllByText('Marvelous Idea')).toHaveLength(2)
      expect(screen.getAllByLabelText('Buyer')).toHaveLength(2)
      expect(screen.getAllByLabelText('Details of request')).toHaveLength(2)
      expect(screen.getAllByText('Requested on: 11/01/2023')).toHaveLength(2)

      // unreleased info
      expect(screen.getByText('Someone at Avalanche')).toBeInTheDocument()
      expect(
        screen.getByText('Released on: Not released yet')
      ).toBeInTheDocument()

      // released info
      expect(screen.getByText('Terra Branford')).toBeInTheDocument()
      expect(screen.getByText('terra.branford@example.com')).toBeInTheDocument()
      expect(screen.getByText('Released on: 11/02/2023')).toBeInTheDocument()
    })

    it('Request Contact Flow - renders disclaimer when clicked and shows success message', async () => {
      mockPutMeIpMarketplaceContactInfo(server, mockIpMarketplaceContactInfo)
      render(<MyRequestsPage />)

      const requestCtas = await screen.findAllByRole('button', {
        name: 'Release info'
      })
      fireEvent.click(requestCtas[0])
      expect(
        screen.getByText(
          'Disclaimer about the release of seller contact information'
        )
      )
      fireEvent.click(
        await screen.findByRole('button', { name: 'Accept & release info' })
      )
      expect(await screen.findByText('Information released successfully'))
      fireEvent.click(await screen.findByRole('button', { name: 'Got it' }))
      await waitForElementToBeRemoved(screen.queryByRole('dialog'))
    })
  })
  describe('Seller - IP with multiple requests', () => {
    beforeEach(() => mockGetUserInfo(server, mockEnterpriseSellerUser))
    beforeEach(() =>
      mockGetIpMarketplace(server, [
        {
          ...mockIpListingWithRequests,
          id: '789abc',
          owner: {
            email: 'sazh.katzroy@redesignhealth.com'
          },
          metrics: {
            viewCount: 300,
            requestCount: 3
          }
        }
      ])
    )

    it('shows separate cards for my listed IP that has multiple requests - two unreleased and one released', async () => {
      render(<MyRequestsPage />)
      expect(await screen.findAllByText('Marvelous Idea')).toHaveLength(3)
      expect(screen.getAllByLabelText('Buyer')).toHaveLength(3)

      // metrics
      const viewCountElements = screen.getAllByTestId('ip-metric-view-count')
      expect(viewCountElements).toHaveLength(3)
      viewCountElements.forEach(element =>
        expect(within(element).getByText(300)).toBeInTheDocument()
      )
      const requestCountElements = screen.getAllByTestId(
        'ip-metric-request-count'
      )
      expect(requestCountElements).toHaveLength(3)
      requestCountElements.forEach(element =>
        expect(within(element).getByText(3)).toBeInTheDocument()
      )

      // unreleased info
      expect(screen.getAllByText('Someone at Avalanche')).toHaveLength(2)

      // released info
      expect(screen.getByText('Terra Branford')).toBeInTheDocument()
      expect(screen.getByText('terra.branford@example.com')).toBeInTheDocument()
    })
    it('renders view count and metrics', async () => {
      render(<MyRequestsPage />)

      const viewCountElements = await screen.findAllByTestId(
        'ip-metric-view-count'
      )
      expect(viewCountElements).toHaveLength(3)
      viewCountElements.forEach(element =>
        expect(within(element).getByText(300)).toBeInTheDocument()
      )
      const requestCountElements = screen.getAllByTestId(
        'ip-metric-request-count'
      )
      expect(requestCountElements).toHaveLength(3)
      requestCountElements.forEach(element =>
        expect(within(element).getByText(3)).toBeInTheDocument()
      )
    })
  })
})
