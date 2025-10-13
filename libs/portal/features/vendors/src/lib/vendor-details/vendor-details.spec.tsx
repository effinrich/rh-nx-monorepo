import { render, screen, waitFor } from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import { adminUser, registerMockEndpoints } from './mocks'
import VendorDetails from './vendor-details'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    vendorId: '123456'
  })
}))

describe('VendorDetails', () => {
  const server = setupServer(...registerMockEndpoints(adminUser))
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
  it('renders document title', async () => {
    render(<VendorDetails />)
    await waitFor(() =>
      expect(document.title).toEqual('Vendor Details: Boomset')
    )
  })

  it('renders successfully', async () => {
    render(<VendorDetails />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(await screen.findByText('Boomset')).toBeInTheDocument()
  })
})
