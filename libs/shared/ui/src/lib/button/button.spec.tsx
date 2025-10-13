import { render } from '@redesignhealth/shared-utils-jest'

import { Button } from './button'

describe('Button', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Button>I'm a button</Button>)
    expect(baseElement).toBeTruthy()
  })
})
