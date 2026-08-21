import { render } from '@redesignhealth/shared-utils-jest'

import {
  DialogBackdrop,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  DialogPositioner,
  DialogRoot
} from './modal'

describe('Dialog', () => {
  it('should render successfully', () => {
    const onOpenChange = jest.fn()
    const { baseElement } = render(
      <DialogRoot open onOpenChange={onOpenChange}>
        <DialogBackdrop />
        <DialogPositioner>
          <DialogContent>
            <DialogHeader>Dialog header</DialogHeader>
            <DialogCloseTrigger data-testid="close" />
          </DialogContent>
        </DialogPositioner>
      </DialogRoot>
    )
    expect(baseElement).toBeTruthy()
  })
})
