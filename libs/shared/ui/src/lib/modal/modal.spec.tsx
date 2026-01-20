import { render } from '@redesignhealth/shared-utils-jest'

import {
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay
} from './modal'

describe('Modal', () => {
  it('should render successfully', () => {
    const onOpenChange = jest.fn()
    const { baseElement } = render(
      <Modal open onOpenChange={onOpenChange}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal header</ModalHeader>
          <ModalCloseButton data-testid="close" />
        </ModalContent>
      </Modal>
    )
    expect(baseElement).toBeTruthy()
  })
})
