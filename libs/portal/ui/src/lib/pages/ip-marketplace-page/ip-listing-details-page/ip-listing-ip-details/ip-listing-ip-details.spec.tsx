import {
  CompanyApiEnum,
  mockGetIpListing,
  mockIpListingWithMetrics
} from '@redesignhealth/portal/data-assets'
import {
  render,
  screen,
  waitForLoadingToFinish
} from '@redesignhealth/shared-utils-jest'
import { within } from '@testing-library/react'
import { setupServer } from 'msw/node'

import IpListingIpDetails from './ip-listing-ip-details'

const PENDING_STATUS: CompanyApiEnum = {
  displayName: 'Pending',
  value: 'PENDING'
}

const OTHER_STATUS: CompanyApiEnum = {
  displayName: 'Other',
  value: 'OTHER'
}

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    ipListingId: '6nuT80li'
  })
}))

describe('IpListingIpDetailsPage', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  beforeEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Seller details', () => {
    it('anonymizes seller info if not provided', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        organization: { name: 'Avalanche' },
        owner: undefined
      })
      render(<IpListingIpDetails />)

      const sellerRow = await screen.findByRole('listitem', { name: 'Seller' })
      expect(
        within(sellerRow).getByText('Someone at Avalanche')
      ).toBeInTheDocument()
    })

    it('shows seller info if owner provided', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        owner: {
          givenName: 'Terra',
          familyName: 'Branford',
          email: 'terra.branford@example.com'
        },
        organization: { name: 'Avalanche' }
      })
      render(<IpListingIpDetails />)
      const sellerRow = await screen.findByRole('listitem', { name: 'Seller' })

      expect(within(sellerRow).getByText('Terra Branford')).toBeInTheDocument()
      expect(
        within(sellerRow).getByText('terra.branford@example.com')
      ).toBeInTheDocument()
    })

    it('shows seller info if request seller info provided', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        owner: undefined,
        requestContactInfo: [
          {
            sellerInfo: {
              givenName: 'Terra',
              familyName: 'Branford',
              email: 'terra.branford@example.com',
              companyName: 'Avalanche'
            },
            dateRequest: '',
            buyerInfo: {
              companyName: 'Shinra'
            }
          }
        ],
        organization: { name: 'Avalanche' }
      })
      render(<IpListingIpDetails />)
      const sellerRow = await screen.findByRole('listitem', { name: 'Seller' })

      expect(within(sellerRow).getByText('Terra Branford')).toBeInTheDocument()
      expect(
        within(sellerRow).getByText('terra.branford@example.com')
      ).toBeInTheDocument()
    })
  })
  describe('Conditional fields', () => {
    it('hides `About license restrictions` if licenses restrictions is not present', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        licenseRestriction: false,
        aboutLicenseRestriction: 'More details'
      })
      render(<IpListingIpDetails />)
      await waitForLoadingToFinish()
      expect(
        screen.queryByRole('listitem', {
          name: 'About license restrictions'
        })
      ).not.toBeInTheDocument()
    })

    it('show `About license restrictions` if licenses restrictions exist', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        licenseRestriction: true,
        aboutLicenseRestriction: 'More details'
      })

      render(<IpListingIpDetails />)
      const row = await screen.findByRole('listitem', {
        name: 'About license restrictions'
      })
      expect(within(row).getByText('More details')).toBeInTheDocument()
    })

    it('hides `Patent status (other)` if status is not OTHER', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        patentStatus: PENDING_STATUS,
        patentStatusOtherInfo: 'More details'
      })

      render(<IpListingIpDetails />)
      await waitForLoadingToFinish()
      expect(
        screen.queryByRole('listitem', { name: 'Patent status (other)' })
      ).not.toBeInTheDocument()
    })

    it('shows `Patent status (other)` if status is OTHER', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        patentStatus: OTHER_STATUS,
        patentStatusOtherInfo: 'More details'
      })

      render(<IpListingIpDetails />)
      const row = await screen.findByRole('listitem', {
        name: 'Patent status (other)'
      })
      expect(within(row).getByText('More details')).toBeInTheDocument()
    })

    it('hides `Patent geography validity (other)` if it does not contain OTHER', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        patentGeographicValidity: [PENDING_STATUS],
        patentGeographicValidityOther: 'More details'
      })

      render(<IpListingIpDetails />)
      await waitForLoadingToFinish()
      expect(
        screen.queryByRole('listitem', {
          name: 'Patent geography validity (other)'
        })
      ).not.toBeInTheDocument()
    })

    it('shows `Patent geography validity (other)` if it conatins OTHER', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        patentGeographicValidity: [OTHER_STATUS],
        patentGeographicValidityOther: 'More details'
      })

      render(<IpListingIpDetails />)
      const row = await screen.findByRole('listitem', {
        name: 'Patent geography validity (other)'
      })
      expect(within(row).getByText('More details')).toBeInTheDocument()
    })

    it('hides Preferred terms (other) if it does not contain OTHER', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        preferredTerms: [PENDING_STATUS]
      })

      render(<IpListingIpDetails />)
      await waitForLoadingToFinish()
      expect(
        screen.queryByRole('listitem', {
          name: 'Preferred terms (other)'
        })
      ).not.toBeInTheDocument()
    })

    it('shows Preferred terms (other) if it does contain OTHER', async () => {
      mockGetIpListing(server, {
        ...mockIpListingWithMetrics,
        preferredTerms: [OTHER_STATUS],
        preferredTermsOther: 'More details'
      })

      render(<IpListingIpDetails />)
      const row = await screen.findByRole('listitem', {
        name: 'Preferred terms (other)'
      })
      expect(within(row).getByText('More details')).toBeInTheDocument()
    })
  })
})
