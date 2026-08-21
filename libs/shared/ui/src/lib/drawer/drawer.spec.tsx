import { render } from '@redesignhealth/shared-utils-jest'

import { DrawerContent, DrawerPositioner, DrawerRoot } from './drawer'

describe('Drawer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DrawerRoot onOpenChange={() => undefined} open>
        <DrawerPositioner>
          <DrawerContent>
            <div>Hello</div>
          </DrawerContent>
        </DrawerPositioner>
      </DrawerRoot>
    )
    expect(baseElement).toBeTruthy()
  })
})
