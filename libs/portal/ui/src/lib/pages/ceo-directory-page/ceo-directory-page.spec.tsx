import {
  mockAdminUser,
  mockCEOCompanyUser,
  mockCeoFilters,
  mockCeos,
  mockCeosNoResults,
  mockCompanyUser,
  mockGetCeos,
  mockGetCeosFilters,
  mockGetUserInfo,
  mockRhUser
} from '@redesignhealth/portal/data-assets'
import { mocks, render, screen } from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import CeoDirectoryPage from './ceo-directory-page'
describe('CEO Directory Page', () => {
  mocks.matchMedia('any', false)
  const server = setupServer()
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  beforeEach(() => mockGetCeosFilters(server, mockCeoFilters))

  describe('with CEO results', () => {
    beforeEach(() => mockGetCeos(server, mockCeos))

    describe('with Admin person', () => {
      beforeEach(() => mockGetUserInfo(server, mockAdminUser))

      it('displays add button', async () => {
        render(<CeoDirectoryPage />)
        expect(
          await screen.findByRole('link', { name: 'Add CEO' })
        ).toBeInTheDocument()
      })

      it('displays visibility off icon for opt-out or not-decided CEOs', async () => {
        render(<CeoDirectoryPage />)
        expect(
          await screen.findAllByLabelText('CEO opt-out icon')
        ).toHaveLength(2)
      })
    })

    describe('with RH User', () => {
      beforeEach(() => mockGetUserInfo(server, mockRhUser))

      it('does not display add button', () => {
        render(<CeoDirectoryPage />)
        expect(
          screen.queryByRole('link', { name: 'Add CEO' })
        ).not.toBeInTheDocument()
      })

      it('displays visibility off icon for opt-out or not-decided CEOs', async () => {
        render(<CeoDirectoryPage />)
        expect(
          await screen.findAllByLabelText('CEO opt-out icon')
        ).toHaveLength(2)
      })
    })

    describe('with CEO person', () => {
      beforeEach(() => mockGetUserInfo(server, mockCEOCompanyUser))

      it('top level details', async () => {
        render(<CeoDirectoryPage />)
        expect(screen.getByText('CEO Directory')).toBeInTheDocument()
        expect(await screen.findByText('Results: 6')).toBeInTheDocument()
      })

      describe('opt-in view', () => {
        it('hides "Opt In" banner', () => {
          render(<CeoDirectoryPage isCeoOptOut={false} />)
          expect(screen.queryByText('Opt-in now')).not.toBeInTheDocument()
        })

        it('can view profiles', async () => {
          render(<CeoDirectoryPage isCeoOptOut={false} />)
          const cards = await screen.findAllByText('View profile')
          expect(cards.length).toBe(6)
        })
      })

      describe('opt-out view', () => {
        it('displays "Opt-in" banner', () => {
          render(<CeoDirectoryPage isCeoOptOut />)
          expect(screen.getByText('Opt-in now')).toBeInTheDocument()
        })
        it('restricts access to profiles', async () => {
          render(<CeoDirectoryPage isCeoOptOut />)
          const cards = await screen.findAllByText('Profile restricted')
          expect(cards.length).toBe(6)
        })
      })
    })
  })

  describe('no CEO results', () => {
    beforeEach(() => mockGetCeos(server, mockCeosNoResults))
    beforeEach(() => mockGetUserInfo(server, mockCompanyUser))

    it('shows no CEOs found messages and no pagination', () => {
      const noResultsTitle = 'No CEOs found'
      const noResultsMessage =
        "Try adjusting your search or filters to find the CEOs you're looking for."
      render(<CeoDirectoryPage />)

      expect(screen.getByText(noResultsTitle)).toBeInTheDocument()
      expect(screen.getByText(noResultsMessage)).toBeInTheDocument()

      expect(screen.queryByText('Previous')).not.toBeInTheDocument()
      expect(screen.queryByText('Next')).not.toBeInTheDocument()
    })
  })
})
