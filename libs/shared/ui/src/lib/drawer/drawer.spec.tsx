import { render } from '@redesignhealth/shared-utils-jest'

import { DrawerRoot, DrawerContent } from './drawer'

describe('Drawer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DrawerRoot onOpenChange={() => ''} open>
        <DrawerContent><div>Hello</div></DrawerContent>
      </DrawerRoot>
    )
    expect(baseElement).toBeTruthy()
  })
})
