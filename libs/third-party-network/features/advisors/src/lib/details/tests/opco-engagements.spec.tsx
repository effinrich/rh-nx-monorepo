/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/no-node-access */
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OpcoEngagements } from '../components/opco-engagements'
import { OpcoEngagement } from '../types'

import { mockUseOpcoEngagementsQuery } from './mocks'

describe('OpcoEngagements', () => {
  it('Loading spinner', () => {
    mockUseOpcoEngagementsQuery(true)
    const { getByText } = renderComponent()
    const spinner = getByText(/loading/i)
    expect(spinner).toBeInTheDocument()
  })

  describe('Popover content', () => {
    beforeEach(() => mockUseOpcoEngagementsQuery(false, [data]))

    it('Truncated review date (MM/DD/YYYY)', () => {
      const { getByLabelText } = renderComponent()
      const date = getByLabelText(/date\b/i)
      expect(date.textContent).toBe(data.reviewDate)
    })

    it('Reviewer name', () => {
      const { getByLabelText } = renderComponent()
      const name = getByLabelText(/reviewer name\b/i)
      expect(name.textContent).toBe(data.reviewerName)
    })

    it('Reviewer areas of expertise', () => {
      const { getByLabelText } = renderComponent()
      const expertise = getByLabelText(/reviewer expertise\b/i)
      expect(expertise.textContent).toBe(data.reviewerExpertise)
    })

    it('5 star ratings', () => {
      const { getByLabelText } = renderComponent()
      const ratingMatcher = new RegExp(`${data.rating} out of 5`)
      const ratings = getByLabelText(ratingMatcher)
      expect(ratings).toBeInTheDocument()
      expect(ratings.children.length).toBe(5)
    })
  })
})

const renderComponent = () => {
  return render(<OpcoEngagements advisorId="id-1" opcoName="name-1" />)
}

const data: OpcoEngagement = {
  type: '',
  rating: 3,
  reviewDate: '1/1/2023',
  reviewerExpertise: 'Expert areas',
  reviewerName: 'John Doe'
}
