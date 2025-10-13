/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/prefer-screen-queries */
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { mockUseCurrentUserQuery } from '../../details/tests/mocks'
import { mockUseIntroductionRequestMutation } from '../../introduction-request/tests/mocks'
import { AdvisorCard } from '../components/advisor-card'

describe('AdvisorCard', () => {
  beforeEach(() => {
    mockUseCurrentUserQuery(false)
    mockUseIntroductionRequestMutation()
  })

  describe('Header', () => {
    it('Avatar with initials', () => {
      const initials = data.name
        .split(' ')
        .map(s => s.charAt(0))
        .join('')

      const { getByLabelText } = renderComponent()
      const avatar = getByLabelText(data.name)
      expect(avatar).toBeInTheDocument()
      expect(avatar?.textContent).toBe(initials)
    })

    it("Advisor's name", () => {
      const { getByText } = renderComponent()
      const name = getByText(data.name)
      expect(name).toBeInTheDocument()
    })
  })

  describe('Attributes', () => {
    it('Current organization and role', () => {
      const { getByText } = renderComponent()
      const role = getByText(/current/i)
      expect(role).toBeInTheDocument()
      expect(role.nextElementSibling?.textContent).toBe(
        `${data.organization} - ${data.advisorRole}`
      )
    })

    it('Opco experience', () => {
      const { getByText } = renderComponent()
      const opcos = getByText(/opco engagements/i)
      expect(opcos).toBeInTheDocument()
      expect(opcos.nextElementSibling?.textContent).toBe(
        data.opcoEngagementNames.join(', ')
      )
    })

    it('A linkedIn link', () => {
      const { getByText } = renderComponent()
      const linkedIn = getByText(/^linkedin$/i)
      const link = getByText(/linkedin profile/i)
      expect(linkedIn).toBeInTheDocument()
      expect(linkedIn.nextElementSibling).toContainElement(link)
      expect(link).toHaveAttribute('href', data.linkedIn)
    })

    it('Categories', () => {
      const { getAllByLabelText } = renderComponent()
      const categories = getAllByLabelText(/category/i)
      const textValues = categories.map(c => c.textContent)
      expect(textValues).toStrictEqual(data.categories)
    })

    it('Tags', () => {
      const { getAllByLabelText } = renderComponent()
      const tag = getAllByLabelText(/tag/i)
      const textValues = tag.map(t => t.textContent)
      expect(textValues).toStrictEqual(data.tags)
    })
  })

  describe('Menu', () => {
    it("A link to the advisor's detail page", () => {
      const { getByText } = renderComponent()
      const link = getByText(/bio/i)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/' + data.advisorId)
    })

    it('An option to request an introduction', () => {
      const { getByText } = renderComponent()
      const request = getByText(/request introduction/i)
      expect(request).toBeInTheDocument()
    })
  })
})

const renderComponent = () => {
  return render(<AdvisorCard {...data} />, { wrapper: BrowserRouter })
}

export const data = {
  advisorId: '1',
  categories: ['category1', 'category2'],
  linkedIn: 'https://google.com',
  name: 'John Doe',
  opcoEngagementNames: ['opco1', 'opco2'],
  organization: 'organization 1',
  advisorRole: 'role 1',
  tags: ['tag1', 'tag2'],
  bio: 'Here is my very cool bio'
}
