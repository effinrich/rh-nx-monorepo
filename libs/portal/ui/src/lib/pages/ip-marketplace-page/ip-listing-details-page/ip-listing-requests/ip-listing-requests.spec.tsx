import {
  mockGetIpListing,
  mockIpListingWithRequests,
  mockIpMarketplaceContactInfo,
  mockPutMeIpMarketplaceContactInfo
} from '@redesignhealth/portal/data-assets'
import { fireEvent, render, screen } from '@redesignhealth/shared-utils-jest'
import { waitForElementToBeRemoved } from '@testing-library/react'
import { setupServer } from 'msw/node'

import IpListingRequests from './ip-listing-requests'
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    ipListingId: '6nuT80li'
  })
}))

describe('IpListingRequests', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  beforeEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('Request Contact Flow', () => {
    it('renders disclaimer when clicked and shows success message', async () => {
      mockGetIpListing(server, mockIpListingWithRequests)
      mockPutMeIpMarketplaceContactInfo(server, mockIpMarketplaceContactInfo)
      render(<IpListingRequests />)

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
})
