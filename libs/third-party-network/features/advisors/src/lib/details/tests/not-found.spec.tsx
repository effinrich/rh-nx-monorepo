import { BrowserRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { NotFound } from '../components/not-found'

describe('NotFound', () => {
  it('Message that there is no user', () => {
    renderComponent()
    const message = screen.getByText(/no advisor found/i)
    expect(message).toBeInTheDocument()
  })
})

const renderComponent = () => {
  return render(<NotFound />, { wrapper: BrowserRouter })
}
