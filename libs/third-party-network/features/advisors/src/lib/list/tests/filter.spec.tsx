import { RhProvider, theme } from '@redesignhealth/ui'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, it, vi } from 'vitest'

import { Filter } from '../components/filter'
import { AdvisorList, FilterName } from '../types'

import { mockUseAllAdvisorsQuery } from './mocks'

describe('Filter', () => {
  beforeEach(() => {
    mockUseAllAdvisorsQuery(false, data)
  })

  it('Loading spinner', () => {
    mockUseAllAdvisorsQuery(true)
    renderComponent('categories', 'Categories')
    const spinner = screen.getByText(/loading/i)
    expect(spinner).toBeInTheDocument()
  })

  describe('Content', () => {
    it('Label', () => {
      renderComponent('categories', 'Categories')
      const label = screen.getByText('Categories')
      expect(label).toBeInTheDocument()
      expect(label.tagName).toBe('LABEL')
    })

    for (const name of filterNames) {
      it(`Supports unique options from ${name}`, async () => {
        const labelText = name.toUpperCase()
        const { user } = renderComponent(name, labelText)
        const input = screen.getByLabelText(labelText)
        await user.click(input)
        const options = getOptions(name).map(
          o => screen.getByText(o).textContent
        )
        expect(input.tagName).toBe('INPUT')
        expect(options).toStrictEqual(getOptions(name))
      })

      it(`Multiple selections from ${name}`, async () => {
        const labelText = name.toUpperCase()
        const firstOption = getOptions(name)[0]
        const { user } = renderComponent(name, labelText)
        const input = screen.getByLabelText(labelText)
        await user.click(input)
        await user.click(screen.getByText(firstOption))
        expect(
          screen.getByLabelText(`Remove ${firstOption}`)
        ).toBeInTheDocument()
      })
    }
  })
})

const renderComponent = (name: FilterName, label: string) => {
  const environment = { getWindow: () => window, getDocument: () => document }
  const utils = render(
    <RhProvider theme={theme} environment={environment}>
      <Filter badgeColor="blue" label={label} name={name} onChange={vi.fn()} />
    </RhProvider>
  )
  return { ...utils, user: userEvent.setup() }
}

const getOptions = (name: FilterName) => {
  const options = data.flatMap(advisor => advisor[name] ?? '')
  return [...new Set(options)]
}

export const data: AdvisorList = [
  {
    categories: ['category1', 'category2'],
    opcoEngagementNames: ['opco1', 'opco2'],
    tags: ['tag1', 'tag2']
  },
  {
    categories: ['category2', 'category3'],
    opcoEngagementNames: ['opco2', 'opco3'],
    tags: ['tag2', 'tag3']
  }
]

const filterNames: Array<FilterName> = [
  'categories',
  'tags',
  'opcoEngagementNames'
]
