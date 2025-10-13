import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { IntroductionRequestForm } from '../components/introduction-request-form'

import { mockUseIntroductionRequestMutation } from './mocks'

describe('IntroductionRequestForm', () => {
  beforeEach(() => mockUseIntroductionRequestMutation())

  it('Header', () => {
    renderComponent()
    const matches = screen.getAllByText(/request/i)
    const header = matches.find(element => element.tagName === 'HEADER')
    const headerText = header?.textContent?.toLowerCase()
    expect(headerText?.includes('introduction')).toBeTruthy()
  })

  it('Request form fields', () => {
    renderComponent()
    const fields = [
      screen.getByLabelText(/requester name/i),
      screen.getByLabelText(/requester email/i),
      screen.getByLabelText(/additional/i),
      screen.getByLabelText(/opco\/concept name/i),
      screen.getByLabelText(/opco\/concept description/i)
    ]
    fields.forEach(field => expect(field.tagName).toMatch(/^INPUT|TEXTAREA$/))
  })

  it('Errors for required form fields', async () => {
    const { user } = renderComponent()
    const matches = screen.getAllByText(/request introduction/i)
    const button = matches.find(el => el.tagName === 'BUTTON') as HTMLElement
    await user.click(button)
    const errors = screen.getAllByText(/required/i)
    expect(button).toBeInTheDocument()
    expect(errors).toHaveLength(4)
  })

  it('Errors for invalid emails', async () => {
    const { user } = renderComponent()
    const field = screen.getByLabelText(/requester email/i)
    await user.type(field, 'randomemail.com')
    const error = screen.getByText(/invalid/i)
    const errorText = error.textContent?.toLowerCase()
    expect(errorText?.includes('email')).toBeTruthy()
  })
})

const renderComponent = (advisorName?: string) => {
  const utils = render(
    <IntroductionRequestForm
      isOpen
      onClose={vi.fn()}
      advisorId={data.advisorId}
      advisorName={advisorName}
    />
  )
  return { ...utils, user: userEvent.setup() }
}

const data = {
  advisorId: 'id-1',
  advisorName: 'John Doe'
}
