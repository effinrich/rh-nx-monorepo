import { render } from '@redesignhealth/shared-utils-jest'

import { StatCard } from './stat-card'

describe('Center', () => {
  it('should render successfully', () => {
    const onClickTestFn = jest.fn()

    const { baseElement } = render(
      <StatCard title="Total OpCos" stat={228} onClick={onClickTestFn} />
    )
    expect(baseElement).toBeTruthy()
  })
})
