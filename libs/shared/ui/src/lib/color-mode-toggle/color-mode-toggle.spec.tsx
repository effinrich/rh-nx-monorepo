import { render } from '@redesignhealth/shared-utils-jest'

import { ColorModeToggle } from './color-mode-toggle'

describe('ColorModeToggle', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<ColorModeToggle />)
    expect(baseElement).toBeTruthy()
  })
})
