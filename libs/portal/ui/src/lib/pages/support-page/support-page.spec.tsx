import {
  mockConsent,
  mockGetMeConsent,
  mockGetUserInfo,
  mockRhUser
} from '@redesignhealth/portal/data-assets'
import { render, screen } from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import SupportPage from './support-page'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}))
describe('Terms', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  beforeEach(() => mockGetUserInfo(server, mockRhUser))
  beforeEach(() => mockGetMeConsent(server, mockConsent))

  it('should render successfully', () => {
    const { baseElement } = render(<SupportPage />)
    expect(baseElement).toBeTruthy()
  })

  it('loads all cards', async () => {
    render(<SupportPage />)

    expect(screen.getByText('Need help? Send us an email!')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Have feedback or new feature ideas? Share them with us!'
      )
    ).toBeInTheDocument()
    expect(
      await screen.findByText('You accepted the Terms of Service on 03/28/2018')
    ).toBeInTheDocument()
  })
})
