import {
  mockAdminUser,
  mockGetCompany,
  mockGetCompanyMembers,
  mockGetUserInfo,
  mockMarketplaceBuyerCompany,
  mockMarketplaceSellerCompany,
  mockRhOpCoCompany
} from '@redesignhealth/portal/data-assets'
import { render, screen } from '@redesignhealth/shared-utils-jest'
import { within } from '@testing-library/react'
import { setupServer } from 'msw/node'

import CompanyUsers from './company-users'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    companyId: '6nuT80li'
  })
}))

describe('CompanyUsers', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  beforeEach(() => {
    server.resetHandlers()
    mockGetUserInfo(server, mockAdminUser)
    mockGetCompanyMembers(server, [mockAdminUser])
  })
  afterAll(() => server.close())

  it('renders description for Marketplace Buyer Company', async () => {
    mockGetCompany(server, mockMarketplaceBuyerCompany)
    render(<CompanyUsers />)
    expect(
      await screen.findByText(
        `Everyone listed here has access to the Redesign Health IP Marketplace through Ever/Body's enterprise account.`
      )
    ).toBeInTheDocument()
  })

  it('renders description for Marketplace Seller Company', async () => {
    mockGetCompany(server, mockMarketplaceSellerCompany)
    render(<CompanyUsers />)
    expect(
      await screen.findByText(
        `Everyone listed here has access to the Redesign Health IP Marketplace through Ever/Body's enterprise account.`
      )
    ).toBeInTheDocument()
  })

  it('renders description for RH Company', async () => {
    mockGetCompany(server, mockRhOpCoCompany)
    render(<CompanyUsers />)
    expect(
      await screen.findByText(
        'The individuals listed here encompass both employees that work at Ever/Body and individuals who are part of the Redesign Health team that provide customer support to Ever/Body. Contact your Relationship Manager to add new users, make edits, or update user permissions.'
      )
    ).toBeInTheDocument()
  })

  it('renders a table of company members if members exist', async () => {
    mockGetCompany(server, mockRhOpCoCompany)
    render(<CompanyUsers />)
    const [header, ...users] = await screen.findAllByRole('row')
    expect(users).toHaveLength(1)
    expect(within(users[0]).getByText('Sazh Katzroy')).toBeInTheDocument()
    expect(
      within(users[0]).getByText('sazh.katzroy@redesignhealth.com')
    ).toBeInTheDocument()
  })

  it('renders an empty state if no members exist', async () => {
    mockGetCompany(server, mockRhOpCoCompany)

    mockGetCompanyMembers(server, [])

    render(<CompanyUsers />)
    expect(
      await screen.findByText('No users added to company yet.')
    ).toBeInTheDocument()
  })
})
