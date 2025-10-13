import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { Search } from '../components/search'

describe('Search', () => {
  it('Label', () => {
    renderComponent()
    const label = screen.getByText(/search/i)
    expect(label.tagName).toBe('LABEL')
  })

  it('Input text', async () => {
    const { user } = renderComponent()
    const input = screen.getByLabelText(/search/i)
    await user.type(input, data.inputText)
    expect(input.tagName).toBe('INPUT')
    expect(input).toHaveValue(data.inputText)
  })
})

const renderComponent = () => {
  const utils = render(<Search onChange={vi.fn()} />)
  return { ...utils, user: userEvent.setup() }
}

const data = {
  inputText: 'Hello World'
}
