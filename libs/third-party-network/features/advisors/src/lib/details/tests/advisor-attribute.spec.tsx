import { List } from '@redesignhealth/ui'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { AdvisorAttribute } from '../components/advisor-attribute'

describe('AdvisorAttribute', () => {
  it('Attribute names', () => {
    renderComponent()
    const attribute = screen.getByText(data.attribute)
    expect(attribute).toBeInTheDocument()
  })

  it('Children', () => {
    renderComponent()
    const content = screen.getByText(data.value)
    expect(content).toBeInTheDocument()
  })
})

const renderComponent = () => {
  return render(
    <List>
      <AdvisorAttribute attribute={data.attribute}>
        {data.value}
      </AdvisorAttribute>
    </List>
  )
}

const data = {
  attribute: 'attribute 1',
  value: 'Hello World'
}
