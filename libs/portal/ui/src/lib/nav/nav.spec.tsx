import {
  mockAdminUser,
  mockCompanyUser,
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockGetIpMarketplace,
  mockIpListingWithUnreleasedIPRequest,
  mockRhUser,
  mockSuperAdminUser
} from '@redesignhealth/portal/data-assets'
import { logout } from '@redesignhealth/portal/utils'
import { render } from '@redesignhealth/shared-utils-jest'
import { fireEvent, screen, within } from '@testing-library/react'
import { setupServer } from 'msw/node'

import { Nav } from './nav'

jest.mock('@redesignhealth/portal/utils', () => {
  const originalModule = jest.requireActual('@redesignhealth/portal/utils')
  return {
    __esModule: true,
    ...originalModule,
    logout: jest.fn()
  }
})

describe('Nav', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('should display the navigation links based on user role', () => {
    it('Super Admin', () => {
      const expectedNavList: string[] = [
        'Home',
        'Companies',
        'Users',
        'Library',
        'Research Hub',
        'Vendor References',
        'CEO Directory',
        'IP Marketplace',
        'Developer Tools',
        'Support & Feedback',
        'Environment Details',
        'log out'
      ]

      render(<Nav userInfo={mockSuperAdminUser} />)

      const nav = screen.getByRole('navigation')
      const actualNavList = within(nav).getAllByRole('button')

      expect(actualNavList).toHaveLength(expectedNavList.length)
      expectedNavList.forEach(expectedNav => {
        expect(
          within(nav).getByRole('button', { name: expectedNav })
        ).toBeInTheDocument()
      })
    })

    it('Admin', () => {
      const expectedNavList: string[] = [
        'Home',
        'Companies',
        'Users',
        'Library',
        'Research Hub',
        'Vendor References',
        'CEO Directory',
        'IP Marketplace',
        'Developer Tools',
        'Support & Feedback',
        'log out'
      ]

      render(<Nav userInfo={mockAdminUser} />)

      const nav = screen.getByRole('navigation')
      const actualNavList = within(nav).getAllByRole('button')

      expect(actualNavList).toHaveLength(expectedNavList.length)
      expectedNavList.forEach(expectedNav => {
        expect(
          within(nav).getByRole('button', { name: expectedNav })
        ).toBeInTheDocument()
      })
    })

    it('RH User', () => {
      const expectedNavList: string[] = [
        'Home',
        'Companies',
        'Library',
        'Research Hub',
        'Vendor References',
        'CEO Directory',
        'Developer Tools',
        'Support & Feedback',
        'log out'
      ]

      render(<Nav userInfo={mockRhUser} />)

      const nav = screen.getByRole('navigation')
      const actualNavList = within(nav).getAllByRole('button')

      expect(actualNavList).toHaveLength(expectedNavList.length)
      expectedNavList.forEach(expectedNav => {
        expect(
          within(nav).getByRole('button', { name: expectedNav })
        ).toBeInTheDocument()
      })
    })
    it('Company User', () => {
      const expectedNavList: string[] = [
        'My Company',
        'Library',
        'Vendor References',
        'CEO Directory',
        'Developer Tools',
        'Support & Feedback',
        'log out'
      ]

      render(<Nav userInfo={mockCompanyUser} />)

      const nav = screen.getByRole('navigation')
      const actualNavList = within(nav).getAllByRole('button')

      expect(actualNavList).toHaveLength(expectedNavList.length)
      expectedNavList.forEach(expectedNav => {
        expect(
          within(nav).getByRole('button', { name: expectedNav })
        ).toBeInTheDocument()
      })
    })

    describe('Enterprise User', () => {
      it('Enterprise buyer', () => {
        mockGetIpMarketplace(server, [mockIpListingWithUnreleasedIPRequest])
        const expectedNavList: string[] = [
          'IP Marketplace',
          'My Requests',
          'Support & Feedback',
          'log out'
        ]

        render(<Nav userInfo={mockEnterpriseBuyerUser} />)
        const nav = screen.getByRole('navigation')
        const actualNavList = within(nav).getAllByRole('button')

        expect(actualNavList).toHaveLength(expectedNavList.length)
        expectedNavList.forEach(expectedNav => {
          expect(
            within(nav).getByRole('button', { name: expectedNav })
          ).toBeInTheDocument()
        })

        expect(
          screen.queryByTestId('unreleased-ip-indicator')
        ).not.toBeInTheDocument()
      })

      it('Enterprise seller', async () => {
        mockGetIpMarketplace(server, [
          {
            ...mockIpListingWithUnreleasedIPRequest,
            owner: {
              email: 'sazh.katzroy@redesignhealth.com'
            }
          }
        ])
        const expectedNavList: string[] = [
          'IP Listings',
          'My Requests',
          'Support & Feedback'
        ]

        render(<Nav userInfo={mockEnterpriseSellerUser} />)

        expectedNavList.forEach(navElement => {
          expect(screen.getByText(navElement)).toBeInTheDocument()
        })

        expect(
          await screen.findByTestId('unreleased-ip-indicator')
        ).toBeInTheDocument()
      })
    })
  })

  it('should display the users name and role', () => {
    render(<Nav userInfo={mockSuperAdminUser} />)

    expect(screen.getByText('Sazh Katzroy')).toBeInTheDocument()
    expect(screen.getByText('Super Admin')).toBeInTheDocument()
  })

  it('should handle logout', () => {
    render(<Nav userInfo={mockAdminUser} />)

    fireEvent.click(screen.getByLabelText('log out'))

    expect(logout).toHaveBeenCalledTimes(1)
    expect(logout).toHaveBeenCalledWith(expect.any(Function))
  })
})
