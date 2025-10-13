import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ErrorAlert } from '../components/error-alert'

describe('ErrorAlert', () => {
  it('Message that there was an error', () => {
    renderComponent()
    const message = screen.getByText(/error/i)
    expect(message).toBeInTheDocument()
  })
})

const renderComponent = () => {
  return render(<ErrorAlert />)
}
