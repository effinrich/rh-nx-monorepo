import { render } from '@redesignhealth/shared-utils-jest'

import { FieldRoot } from './form-control'

describe('Field', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FieldRoot />)
    expect(baseElement).toBeTruthy()
  })
})
