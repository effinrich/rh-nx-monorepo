import {
  mockAdminUser,
  mockConsent,
  mockGetMeConsent,
  mockGetMeConsentNotFound,
  mockGetUserInfo
} from '@redesignhealth/portal/data-assets'
import {
  render,
  screen,
  waitForLoadingToFinish
} from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import TermsChecker from './terms-checker'

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    companyId: '123456'
  }),
  useNavigate: () => mockNavigate
}))

describe('Terms Checker', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  beforeEach(() => server.resetHandlers())
  afterEach(() => mockNavigate.mockReset())
  afterAll(() => server.close())

  it('show terms if they have not been accepted', async () => {
    mockGetUserInfo(server, mockAdminUser)
    mockGetMeConsentNotFound(server)
    render(<TermsChecker>Content</TermsChecker>)
    await waitForLoadingToFinish()
    expect(screen.getByText('Terms of Service'))
  })

  it('show content if terms have been accepted', async () => {
    mockGetUserInfo(server, mockAdminUser)
    mockGetMeConsent(server, mockConsent)
    render(<TermsChecker>Content</TermsChecker>)
    await waitForLoadingToFinish()
    expect(screen.getByText('Content')).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
