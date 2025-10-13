import {
  mockEnterpriseBuyerUser,
  mockGetIpListing,
  mockGetUserInfo,
  mockIpListingWithMetrics
} from '@redesignhealth/portal/data-assets'
import {
  render,
  waitFor,
  waitForLoadingToFinish
} from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import IpListingDetails from './ip-listing-details'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    ipListingId: '6nuT80li'
  }),
  useNavigate: () => jest.fn()
}))

describe('IpMarketplaceDetails', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  beforeEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('renders document title with IP name', async () => {
    mockGetIpListing(server, mockIpListingWithMetrics)
    mockGetUserInfo(server, mockEnterpriseBuyerUser)
    render(<IpListingDetails />)
    await waitForLoadingToFinish()
    await waitFor(() =>
      expect(document.title).toEqual('IP Listing Details: Marvelous Idea')
    )
  })
})
