import {
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockGetIpMarketplace,
  mockGetIpMarketplaceFilters,
  mockGetUserInfo,
  mockIpListing,
  mockIpListingWithOwner,
  mockIpListingWithRequests,
  mockIpMarketplaceFilters
} from '@redesignhealth/portal/data-assets'
import {
  fireEvent,
  mocks,
  render,
  screen
} from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import IPMarketplacePage from './ip-marketplace-page'

describe('IP Marketplace Page - Buyer or Admin', () => {
  mocks.matchMedia('any', false)

  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  beforeEach(() =>
    mockGetIpMarketplace(server, [
      mockIpListing,
      { ...mockIpListingWithRequests, id: '123abc' }
    ])
  )
  beforeEach(() =>
    mockGetIpMarketplaceFilters(server, mockIpMarketplaceFilters)
  )
  beforeEach(() => mockGetUserInfo(server, mockEnterpriseBuyerUser))

  it('should render successfully', async () => {
    const { baseElement } = render(<IPMarketplacePage />)
    expect(baseElement).toBeTruthy()
  })

  it('should show data', async () => {
    render(<IPMarketplacePage />)
    expect(await screen.findAllByText('Marvelous Idea')).toHaveLength(2)
  })

  it('renders buyer/admin specific text', async () => {
    render(<IPMarketplacePage />)
    expect(await screen.findByText('IP Marketplace')).toBeInTheDocument()
    expect(
      screen.getByText('Hide IP listings that I requested info for')
    ).toBeInTheDocument()
  })
  it('hides one IP Listing that I requested when checkbox is clicked', async () => {
    render(<IPMarketplacePage />)

    expect(await screen.findAllByText('Marvelous Idea')).toHaveLength(2)

    fireEvent.click(screen.getByRole('checkbox'))

    expect(
      await screen.findByRole('checkbox', { checked: true })
    ).toBeInTheDocument()
    expect(screen.getByText('Marvelous Idea')).toBeInTheDocument()
    expect(screen.getByText('Results: 1'))
  })

  describe('IP marketplace results where user has requested all available IPs', () => {
    beforeEach(() =>
      mockGetIpMarketplace(server, [
        mockIpListingWithRequests,
        {
          ...mockIpListingWithRequests,
          id: '123abc'
        }
      ])
    )
    it('Hides all IP Listings since I requested everything; shows no results found', async () => {
      render(<IPMarketplacePage />)

      expect(await screen.findAllByText('Marvelous Idea')).toHaveLength(2)

      fireEvent.click(screen.getByRole('checkbox'))

      expect(
        await screen.findByRole('checkbox', { checked: true })
      ).toBeInTheDocument()
      expect(screen.getByText('No IPs found')).toBeInTheDocument()
      expect(screen.getByText('Results: 0'))
    })
  })
})

describe('IP Listing Page - Seller', () => {
  mocks.matchMedia('any', false)

  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  beforeEach(() =>
    mockGetIpMarketplace(server, [
      mockIpListingWithOwner,
      {
        ...mockIpListingWithOwner,
        id: '123abc',
        owner: {
          email: 'sazh.katzroy@redesignhealth.com'
        }
      }
    ])
  )
  beforeEach(() =>
    mockGetIpMarketplaceFilters(server, mockIpMarketplaceFilters)
  )
  beforeEach(() => mockGetUserInfo(server, mockEnterpriseSellerUser))
  it('renders seller specific text', async () => {
    render(<IPMarketplacePage />)
    expect(await screen.findByText('IP Listings')).toBeInTheDocument()
    expect(
      screen.getByText('Hide IP listings from other sellers in my organization')
    ).toBeInTheDocument()
  })
  it('hides one IP Listing from other sellers in my org when checkbox is clicked', async () => {
    render(<IPMarketplacePage />)

    expect(await screen.findAllByText('Marvelous Idea')).toHaveLength(2)

    fireEvent.click(screen.getByRole('checkbox'))

    expect(
      await screen.findByRole('checkbox', { checked: true })
    ).toBeInTheDocument()
    expect(screen.getByText('Marvelous Idea')).toBeInTheDocument()
    expect(screen.getByText('Results: 1'))
  })

  describe('IP listing results when the listings are all from other sellers in my org', () => {
    beforeEach(() =>
      mockGetIpMarketplace(server, [
        mockIpListingWithOwner,
        {
          ...mockIpListingWithOwner,
          id: '123abc'
        }
      ])
    )
    it('Hides all IP Listings since they are all from my org; shows no results found', async () => {
      render(<IPMarketplacePage />)

      expect(await screen.findAllByText('Marvelous Idea')).toHaveLength(2)

      fireEvent.click(screen.getByRole('checkbox'))

      expect(
        await screen.findByRole('checkbox', { checked: true })
      ).toBeInTheDocument()
      expect(screen.getByText('No IPs found')).toBeInTheDocument()
      expect(screen.getByText('Results: 0'))
    })
  })
})
