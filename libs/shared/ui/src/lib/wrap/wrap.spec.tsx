import { render } from '@redesignhealth/shared-utils-jest'

import { Wrap } from './wrap'

describe('Wrap', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Wrap />)
    expect(baseElement).toBeTruthy()
  })
})
