import { render } from '@redesignhealth/shared-utils-jest'

import { Drawer } from './drawer'

describe('Drawer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Drawer children={<div>Hello</div>} onClose={() => ''} open />
    )
    expect(baseElement).toBeTruthy()
  })
})
