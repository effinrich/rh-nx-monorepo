import {
  mockCategory,
  mockCompanyUser,
  mockGetCategories,
  mockGetUserInfo,
  mockGetVendors,
  mockSuperAdminUser,
  mockVendor
} from '@redesignhealth/portal/data-assets'
import { mocks, render, screen } from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import { VendorReferencesPage } from './vendor-references-page'

describe('Vendors Page', () => {
  mocks.matchMedia('any', true)
  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  beforeEach(() => {
    mockGetCategories(server, [mockCategory])
    mockGetVendors(server, [mockVendor])
  })

  describe('rendering Add CTA button', () => {
    it('renders for Super Admin', async () => {
      mockGetUserInfo(server, mockSuperAdminUser)
      render(<VendorReferencesPage />)
      expect(await screen.findByText('Add vendor')).toBeInTheDocument()
    })

    it('renders for Company User', async () => {
      mockGetUserInfo(server, mockCompanyUser)
      render(<VendorReferencesPage />)
      expect(await screen.findByText('Add vendor')).toBeInTheDocument()
    })
  })
})
