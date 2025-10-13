import { render } from '@redesignhealth/shared-utils-jest'

import { List } from './list'

describe('List', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<List />)
    expect(baseElement).toBeTruthy()
  })
})
