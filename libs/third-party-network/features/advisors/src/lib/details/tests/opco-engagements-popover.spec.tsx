import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { OpcoEngagementsPopover } from '../components/opco-engagements-popover'

describe('OpcoEngagementPopover', () => {
  it('Opco name and children', () => {
    renderComponent(data.opcoName)
    const name = screen.getByText(data.opcoName)
    const children = screen.getByText(data.content)
    expect(name).toBeInTheDocument()
    expect(children).toBeInTheDocument()
  })

  it('Does not show anything if opco name is not provided', () => {
    renderComponent()
    expect(
      screen.queryByRole('heading', { name: data.opcoName })
    ).not.toBeInTheDocument()
  })
})

const renderComponent = (opcoName?: string) => {
  return render(
    <OpcoEngagementsPopover opcoName={opcoName}>
      {data.content}
    </OpcoEngagementsPopover>
  )
}

const data = {
  opcoName: 'opco1',
  content: 'Hello World'
}
