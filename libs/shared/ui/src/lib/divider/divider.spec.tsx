import { render } from '@redesignhealth/shared-utils-jest'

import { Separator } from './divider'

describe('Separator', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Separator />)
    expect(baseElement).toBeTruthy()
  })
})
