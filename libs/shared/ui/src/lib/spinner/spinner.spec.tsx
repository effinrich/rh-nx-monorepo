import { render } from '@redesignhealth/shared-utils-jest'

import { Spinner } from './spinner'

describe('Spinner', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Spinner />)
    expect(baseElement).toBeTruthy()
  })
})
