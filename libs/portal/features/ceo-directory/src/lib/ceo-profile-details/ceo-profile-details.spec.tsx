import {
  mockAdminUser,
  mockCEOCompanyUser,
  mockCeoOptIn,
  mockCeoOptOut,
  mockCompanyUser,
  mockGetCeoById,
  mockGetUserInfo,
  mockRhUser
} from '@redesignhealth/portal/data-assets'
import { render, screen, waitFor } from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import CeoProfileDetails from './ceo-profile-details'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    ceoId: '6nuT80li'
  })
}))

describe('CeoProfileDetails', () => {
  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  const editProfileButtonLabel = 'Edit profile'
  const visibilityIconLabel = 'CEO opt-out icon'
  const optInRowText = 'CEO Directory opt-in?'
  describe('Admin user', () => {
    beforeEach(() => mockGetUserInfo(server, mockAdminUser))
    describe('opt-in CEO', () => {
      beforeEach(() => mockGetCeoById(server, mockCeoOptIn))

      it('show edit button; do not show icon for opt-in CEO; do not show opt in row text', async () => {
        render(<CeoProfileDetails />)

        expect(
          await screen.findByLabelText(editProfileButtonLabel)
        ).toBeInTheDocument()
        expect(
          screen.queryByLabelText(visibilityIconLabel)
        ).not.toBeInTheDocument()
        expect(screen.queryByText(optInRowText)).not.toBeInTheDocument()
      })

      it('renders document title with CEO name', async () => {
        render(<CeoProfileDetails />)
        await waitFor(() =>
          expect(document.title).toEqual('CEO Profile Details: Sazh Katzroy')
        )
      })
    })
    describe('opt-out CEO', () => {
      beforeEach(() => mockGetCeoById(server, mockCeoOptOut))
      it('show edit button; show visibility icon; do not show opt in row text', async () => {
        render(<CeoProfileDetails />)

        expect(
          await screen.findByLabelText(editProfileButtonLabel)
        ).toBeInTheDocument()
        expect(screen.getByLabelText(visibilityIconLabel)).toBeInTheDocument()
        expect(screen.queryByText(optInRowText)).not.toBeInTheDocument()
      })
    })
  })
  describe('RH user', () => {
    beforeEach(() => mockGetUserInfo(server, mockRhUser))
    describe('opt-in CEO', () => {
      beforeEach(() => mockGetCeoById(server, mockCeoOptIn))

      it('do not show edit button; do not show icon for opt-in CEO; do not show opt in row text', () => {
        render(<CeoProfileDetails />)

        expect(
          screen.queryByLabelText(editProfileButtonLabel)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByLabelText(visibilityIconLabel)
        ).not.toBeInTheDocument()
        expect(screen.queryByText(optInRowText)).not.toBeInTheDocument()
      })

      it('renders document title with CEO name', async () => {
        render(<CeoProfileDetails />)
        await waitFor(() =>
          expect(document.title).toEqual('CEO Profile Details: Sazh Katzroy')
        )
      })
    })
    describe('opt-out CEO', () => {
      beforeEach(() => mockGetCeoById(server, mockCeoOptOut))

      it('do not show edit button; show visibility icon; do not show opt in row text', async () => {
        render(<CeoProfileDetails />)

        expect(
          await screen.findByLabelText(visibilityIconLabel)
        ).toBeInTheDocument()
        expect(
          screen.queryByLabelText(editProfileButtonLabel)
        ).not.toBeInTheDocument()
        expect(screen.queryByText(optInRowText)).not.toBeInTheDocument()
      })
    })
  })
  describe('Company user viewing CEO profile', () => {
    beforeEach(() => mockGetUserInfo(server, mockCompanyUser))

    describe('opt-in CEO', () => {
      beforeEach(() => mockGetCeoById(server, mockCeoOptIn))

      it('do not show edit button; do not show visibility icon; do not show opt in row text', async () => {
        render(<CeoProfileDetails />)

        expect(
          screen.queryByLabelText(editProfileButtonLabel)
        ).not.toBeInTheDocument()
        expect(
          screen.queryByLabelText(visibilityIconLabel)
        ).not.toBeInTheDocument()
        expect(screen.queryByText(optInRowText)).not.toBeInTheDocument()
      })
    })

    describe.skip('opt-out CEO - currently not implemented', () => {
      beforeEach(() => mockGetCeoById(server, mockCeoOptOut))

      it('do not show CEO', async () => {
        render(<CeoProfileDetails />)
      })
    })
  })

  describe('CEO user viewing their own profile', () => {
    beforeEach(() => mockGetUserInfo(server, mockCEOCompanyUser))

    describe('opt-in CEO', () => {
      beforeEach(() => mockGetCeoById(server, mockCeoOptIn))

      it('show edit button; do not show visibility icon; show opt in row on card', async () => {
        render(<CeoProfileDetails />)

        expect(
          await screen.findByLabelText(editProfileButtonLabel)
        ).toBeInTheDocument()
        expect(
          screen.queryByLabelText(visibilityIconLabel)
        ).not.toBeInTheDocument()
        expect(screen.getByText(optInRowText)).toBeInTheDocument()
        expect(screen.getByText(/Yes, I want to/))
      })
    })

    describe('opt-out CEO', () => {
      beforeEach(() => mockGetCeoById(server, mockCeoOptOut))

      it('show edit button; do not show visibility icon; show opt out row on card', async () => {
        render(<CeoProfileDetails />)

        expect(
          await screen.findByLabelText(editProfileButtonLabel)
        ).toBeInTheDocument()
        expect(
          screen.queryByLabelText(visibilityIconLabel)
        ).not.toBeInTheDocument()
        expect(screen.getByText(optInRowText)).toBeInTheDocument()
        expect(screen.getByText(/No, I do not want to/))
      })
    })
  })
})
