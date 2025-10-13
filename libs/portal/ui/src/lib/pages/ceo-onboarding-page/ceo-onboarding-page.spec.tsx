import { act } from 'react-dom/test-utils'
import {
  fireEvent,
  mocks,
  render,
  screen
} from '@redesignhealth/shared-utils-jest'
import { setupServer } from 'msw/node'

import CeoDirectoryOnboardingPage from './ceo-onboarding-page'
import { registerMockEndpoints } from './mocks'

describe('CEO Directory Onboarding Page', () => {
  mocks.matchMedia('any', false)
  const server = setupServer(...registerMockEndpoints())
  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('upon landing, displays title and help text', () => {
    render(<CeoDirectoryOnboardingPage />)
    expect(screen.getByText('Welcome to the CEO Directory')).toBeInTheDocument()
    expect(
      screen.getByText('Please complete this short 2min onboarding')
    ).toBeInTheDocument()
  })

  it('choose opt-in, displays title and help text, loads ceo form', async () => {
    render(<CeoDirectoryOnboardingPage />)

    const optInRadio = screen.getByDisplayValue('OPT_IN')
    fireEvent.click(optInRadio)

    const continueButton = screen.getByText('Continue')
    fireEvent.click(continueButton)

    expect(screen.getByText('Thanks for opting-in!')).toBeInTheDocument()
    expect(
      screen.getByText('Please complete this short 2min onboarding')
    ).toBeInTheDocument()
    expect(
      // TODO: CI Tests seem to fail on this query
      // Increasing the timeout fixes the issue for now
      await screen.findByText('Sazh Katzroy', {}, { timeout: 5000 })
    ).toBeInTheDocument()
    expect(screen.getByText('Personal details'))
  })

  it('choose opt-out, display displays title and help text', () => {
    render(<CeoDirectoryOnboardingPage />)
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      const optOutRadio = screen.getByDisplayValue('OPT_OUT')
      optOutRadio.click()

      const continueButton = screen.getByText('Continue')
      continueButton.click()
    })

    expect(screen.getByText("You're opting out")).toBeInTheDocument()
    expect(
      screen.getByText(
        "No worries, you'll still have limited access to the directory"
      )
    ).toBeInTheDocument()
  })
})
