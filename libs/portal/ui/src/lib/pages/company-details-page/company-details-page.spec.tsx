import {
  CompanySummary,
  mockAdminUser,
  mockCompanyUser,
  mockGetCompany,
  mockGetUserInfo,
  mockMarketplaceBuyerCompany,
  mockMarketplaceSellerCompany,
  mockRhOpCoCompany,
  mockRhThemeCompany
} from '@redesignhealth/portal/data-assets'
import {
  render,
  screen,
  waitForLoadingToFinish
} from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import CompanyDetailsPage from './company-details-page'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    companyId: '123456'
  }),
  useNavigate: () => jest.fn()
}))

describe('CompanyDetailsPage', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  describe('renders header', () => {
    beforeEach(() => mockGetUserInfo(server, mockAdminUser))
    it('renders name, number, status for RH Company', async () => {
      mockGetCompany(server, mockRhOpCoCompany)
      render(<CompanyDetailsPage />)
      await waitForLoadingToFinish()

      expect(screen.getByText('Ever/Body')).toBeInTheDocument()
      expect(screen.getByText('#3')).toBeInTheDocument()
      expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    })

    it('renders name, activity type for Marketplace Company', async () => {
      mockGetCompany(server, mockMarketplaceBuyerCompany)
      render(<CompanyDetailsPage />)
      await waitForLoadingToFinish()

      expect(screen.getByText('Ever/Body')).toBeInTheDocument()
      expect(screen.getByText('Enterprise Buyer')).toBeInTheDocument()
    })
  })
  describe('rendering tabs', () => {
    beforeEach(() => mockGetUserInfo(server, mockAdminUser))
    it('renders default tabs', async () => {
      mockGetCompany(server, mockRhThemeCompany)
      render(<CompanyDetailsPage />)
      await waitForLoadingToFinish()

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(2)
      expect(tabs[0].textContent).toEqual('Overview')
      expect(tabs[1].textContent).toEqual('Users')
    })

    it('renders infra/vendors tabs for OP_CO stage companies', async () => {
      mockGetCompany(server, mockRhOpCoCompany)
      render(<CompanyDetailsPage />)
      await waitForLoadingToFinish()

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(5)
      expect(tabs[0].textContent).toEqual('Overview')
      expect(tabs[1].textContent).toEqual('Users')
      expect(tabs[2].textContent).toEqual('Infrastructure')
      expect(tabs[3].textContent).toEqual('Vendors')
      expect(tabs[4].textContent).toEqual('Expert Network')
    })

    it('renders IP tab is seller', async () => {
      mockGetCompany(server, mockMarketplaceSellerCompany)
      render(<CompanyDetailsPage />)
      await waitForLoadingToFinish()

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(2)
      expect(tabs[0].textContent).toEqual('All IP')
      expect(tabs[1].textContent).toEqual('Users')
    })

    it('renders only Users tab for buyer', async () => {
      mockGetCompany(server, mockMarketplaceBuyerCompany)
      render(<CompanyDetailsPage />)
      await waitForLoadingToFinish()

      const tabs = screen.getAllByRole('tab')
      expect(tabs).toHaveLength(1)
      expect(tabs[0].textContent).toEqual('Users')
    })
  })

  it('displays edit button for admins', async () => {
    mockGetUserInfo(server, mockAdminUser)
    mockGetCompany(server, mockRhOpCoCompany)
    render(<CompanyDetailsPage />)
    await waitForLoadingToFinish()

    expect(screen.getByLabelText('Edit company')).toBeInTheDocument()
  })

  it('hides edit button for company users', async () => {
    mockGetUserInfo(server, mockCompanyUser)
    mockGetCompany(server, mockRhOpCoCompany)
    render(<CompanyDetailsPage />)
    await waitForLoadingToFinish()

    expect(screen.queryByLabelText('Edit company')).not.toBeInTheDocument()
  })
})
