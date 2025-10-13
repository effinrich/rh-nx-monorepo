import { mockGetUserInfo, mockRhUser } from '@redesignhealth/portal/data-assets'
import { render, screen } from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import Terms from './terms'

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
  const onClose = jest.fn()
  it('should render successfully', () => {
    const { baseElement } = render(
      <Terms isAskingConsent isOpen onClose={onClose} />
    )
    expect(baseElement).toBeTruthy()
    expect(screen.getByText('Terms of Service')).toBeInTheDocument()
  })

  it('should show accept and decline buttons when flag is true', () => {
    render(<Terms isAskingConsent isOpen onClose={onClose} />)
    expect(screen.getByRole('button', { name: 'Decline' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Accept' })).toBeInTheDocument()
  })

  it('should show close button when flag is false', () => {
    render(<Terms isOpen onClose={onClose} />)
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
  })
})
