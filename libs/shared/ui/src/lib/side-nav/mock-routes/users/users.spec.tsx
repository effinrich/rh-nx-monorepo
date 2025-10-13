import { render } from '@redesignhealth/shared-utils-jest'

import Users from './users'

describe('Users', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Users />)
    expect(baseElement).toBeTruthy()
  })
})
