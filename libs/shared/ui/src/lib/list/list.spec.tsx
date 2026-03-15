import { render } from '@redesignhealth/shared-utils-jest'

import { ListRoot } from './list'

describe('List', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ListRoot />)
    expect(baseElement).toBeTruthy()
  })
})
