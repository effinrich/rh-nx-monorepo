/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/prefer-screen-queries */
import { BrowserRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import { mockUseIntroductionRequestMutation } from '../../introduction-request/tests/mocks'
import { AdvisorDetails } from '../components/advisor-details'
import { Advisor } from '../types'

import {
  mockUseAdvisorQuery,
  mockUseCurrentUserQuery,
  mockUseOpcoEngagementsQuery
} from './mocks'

describe('AdvisorDetails', () => {
  beforeEach(() => {
    mockUseAdvisorQuery(false, data)
    mockUseCurrentUserQuery(false)
    mockUseOpcoEngagementsQuery(false)
    mockUseIntroductionRequestMutation()
  })

  it('Loading spinner', () => {
    mockUseAdvisorQuery(true)
    const { getByText } = renderComponent()
    const spinner = getByText(/loading/i)
    expect(spinner).toBeInTheDocument()
  })

  describe('Content', () => {
    it('Advisor name', () => {
      const { getByText } = renderComponent()
      const name = getByText(data.name)
      expect(name).toBeInTheDocument()
    })

    it('Option to request an introduction', () => {
      const { getByText } = renderComponent()
      const request = getByText(/request introduction/i)
      expect(request).toBeInTheDocument()
      expect(request.tagName).toBe('BUTTON')
    })

    it('Option to request a contract', () => {
      const { getByText } = renderComponent()
      const request = getByText(/request contract/i)
      expect(request).toBeInTheDocument()
      expect(request.tagName).toBe('A')
    })

    it('Advisor categories', () => {
      const { getAllByLabelText } = renderComponent()
      const categories = getAllByLabelText('category')
      const textValues = categories.map(c => c.textContent)
      expect(categories.length).toBe(2)
      expect(textValues).toEqual(data.categories)
    })

    it('Advisor tags', () => {
      const { getAllByLabelText } = renderComponent()
      const tags = getAllByLabelText(/tag/i)
      const textValues = tags.map(t => t.textContent)
      expect(tags.length).toBe(2)
      expect(textValues).toEqual(data.tags)
    })

    it('Advisor bio', () => {
      const { getByText } = renderComponent()
      const bio = getByText(/bio\b/i)
      expect(bio).toBeInTheDocument()
      expect(bio.nextElementSibling?.textContent).toBe(data.bio)
    })

    it('Advisor current organization and role', () => {
      const { getByText } = renderComponent()
      const role = getByText(/current/i)
      expect(role).toBeInTheDocument()
      expect(role.nextElementSibling?.textContent).toBe(
        `${data.organization} - ${data.role}`
      )
    })

    it('Advisor previous organization and role', () => {
      const { getByText } = renderComponent()
      const role = getByText(/previous/i)
      expect(role).toBeInTheDocument()
      expect(role.nextElementSibling?.textContent).toBe(data.previousOrgAndRole)
    })

    it('# of advising introductions', () => {
      const { getByText } = renderComponent()
      const calls = getByText(/introductions/i)
      expect(calls).toBeInTheDocument()
      expect(calls.nextElementSibling?.textContent).toBe(data.numIntroductions)
    })

    it('Opco engagements', () => {
      const { getByText } = renderComponent()
      const engagements = getByText(/engagements/i)
      expect(engagements).toBeInTheDocument()
      expect(engagements.nextElementSibling).toBeInTheDocument()
    })

    it('Who referred the advisor and when they were referred', () => {
      const { getByText } = renderComponent()
      const referrer = getByText(/referred by\b/i)
      expect(referrer).toBeInTheDocument()
      expect(referrer.nextElementSibling).toBeInTheDocument()
    })

    it('Opco conflicts', () => {
      const { getByText } = renderComponent()
      const conflicts = getByText(/conflicts/i)
      expect(conflicts).toBeInTheDocument()
      expect(conflicts.nextElementSibling?.textContent).toBe(data.opcoConflicts)
    })

    it('Taxonomy tags', () => {
      const { getByText } = renderComponent()
      const tags = getByText(/taxonomy tags\b/i)
      expect(tags).toBeInTheDocument()
      expect(tags.nextElementSibling?.textContent).toBe(data.taxonomyTagsText)
    })

    it('Tier', () => {
      const { getByText } = renderComponent()
      const tier = getByText(/tier\b/i)
      expect(tier).toBeInTheDocument()
      expect(tier.nextElementSibling?.textContent).toBe(data.tier)
    })
  })
})

const renderComponent = () => {
  return render(<AdvisorDetails advisorId="id-1" />, { wrapper: BrowserRouter })
}

export const data: Required<Advisor> = {
  id: 'id-1',
  name: 'John Doe',
  bio: 'Cool biography',
  status: 'Active',
  organization: 'Organization 1',
  role: 'Role 1',
  cv: 'https://example.com',
  linkedIn: 'https://example.com',
  website: 'https://example.com',
  categories: ['category 1', 'category 2'],
  tags: ['tag 1', 'tag 2'],
  referrerName: 'Jane Doe',
  referallDate: '1/1/2023',
  expertise: 'Expertise areas',
  opcoEngagementNames: ['opco-1', 'opco-2'],
  numIntroductions: '10',
  opcoConflicts: 'Company1, Company2',
  previousOrgAndRole: 'Old Company1 - Old Role 1',
  taxonomyTagsText: 'Taxonomy Tag 1, Taxonomy Tag 2',
  tier: 'Tier1'
}
