import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { AdvisorBio } from '../components/advisor-bio'

describe('AdvisorBio', () => {
  it('Shows info icon', () => {
    renderComponent()
    const icon = screen.getByLabelText(/info/i)
    expect(icon.tagName).toBe('svg')
  })

  it('Shows biography', async () => {
    const { user } = renderComponent()
    const icon = screen.getByLabelText(/info/i)

    user.hover(icon)

    await waitFor(() => {
      const bio = screen.getByText(data)
      expect(bio).toBeInTheDocument()
    })
  })
})

const renderComponent = () => {
  const utils = render(<AdvisorBio bio={data} />)
  return { ...utils, user: userEvent.setup() }
}

const data = 'Here is my cool biography'
