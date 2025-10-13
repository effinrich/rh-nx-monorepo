import {
  mockGetIpMarketplace,
  mockIpListing
} from '@redesignhealth/portal/data-assets'
import {
  render,
  screen,
  waitForLoadingToFinish
} from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import CompanyIpListing from './company-ip-listing'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    companyId: '123456'
  }),
  useNavigate: () => jest.fn()
}))

describe('CompanyIpListing', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('renders empty state', async () => {
    mockGetIpMarketplace(server, [])
    render(<CompanyIpListing />)
    await waitForLoadingToFinish()
    screen.getByText('No IP records exist for this company')
  })

  it('renders list', async () => {
    mockGetIpMarketplace(server, [mockIpListing])
    render(<CompanyIpListing />)
    await waitForLoadingToFinish()
    expect(screen.getByText('Marvelous Idea')).toBeInTheDocument()
  })
})
