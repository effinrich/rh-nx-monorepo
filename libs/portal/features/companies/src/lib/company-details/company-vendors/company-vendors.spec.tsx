import {
  mockAdminUser,
  mockCompanyVendor,
  mockGetCompanyVendors,
  mockGetUserInfo
} from '@redesignhealth/portal/data-assets'
import {
  render,
  screen,
  waitForLoadingToFinish
} from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import CompanyVendors from './company-vendors'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    companyId: '6nuT80li'
  })
}))

describe('CompanyVendors', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  beforeEach(() => {
    server.resetHandlers()
    mockGetUserInfo(server, mockAdminUser)
  })
  afterAll(() => server.close())

  it('renders heading information', async () => {
    mockGetCompanyVendors(server, [])
    render(<CompanyVendors />)

    expect(
      await screen.findByText(
        `Be sure to keep this list updated if there are any changes in your engagement with vendors.`
      )
    ).toBeInTheDocument()
  })

  it('renders a list of vendors if they exist', async () => {
    mockGetCompanyVendors(server, [mockCompanyVendor])
    render(<CompanyVendors />)
    expect(await screen.findByText(mockCompanyVendor.name)).toBeInTheDocument()
  })

  it('renders an empty state if no vendors exist', async () => {
    mockGetCompanyVendors(server, [])
    render(<CompanyVendors />)
    await waitForLoadingToFinish()
    expect(
      screen.getByText(
        `No vendors added yet. Once you've engaged a vendor, please tell us a little about them by adding them to your Vendors list.`
      )
    ).toBeInTheDocument()
  })
})
