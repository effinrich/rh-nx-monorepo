import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { SuccessConfirmation } from '../components/success-confirmation'

describe('SuccessConfirmation', () => {
  it('Header with an indication for success', () => {
    renderComponent(vi.fn())
    const header = screen.getByText(/success/i)
    expect(header.tagName).toBe('HEADER')
  })

  it('Message without advisor name', () => {
    renderComponent(vi.fn())
    const message = screen.getByText(/your request/i)
    const messageText = message.textContent?.toLowerCase()
    expect(messageText?.includes('advisor')).toBeTruthy()
  })

  it('Message with advisor name', () => {
    renderComponent(vi.fn(), data.advisorName)
    const message = screen.getByText(/your request/i)
    const messageText = message.textContent
    expect(messageText?.includes(data.advisorName)).toBeTruthy()
  })

  it('Option to close confirmation', async () => {
    const mockOnClose = vi.fn()
    const { user } = renderComponent(mockOnClose)
    const button = screen.getByText(/close/i)
    await user.click(button)
    expect(button.tagName).toBe('BUTTON')
    expect(mockOnClose).toHaveBeenCalledOnce()
  })
})

const renderComponent = (onClose: VoidFunction, advisorName?: string) => {
  const utils = render(
    <SuccessConfirmation isOpen onClose={onClose} advisorName={advisorName} />
  )

  return { ...utils, user: userEvent.setup() }
}

const data = {
  advisorName: 'John Doe'
}
