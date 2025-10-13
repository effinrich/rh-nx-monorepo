import { render } from '@redesignhealth/shared-utils-jest'

import { Center } from './center'

describe('Center', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Center />)
    expect(baseElement).toBeTruthy()
  })
})
