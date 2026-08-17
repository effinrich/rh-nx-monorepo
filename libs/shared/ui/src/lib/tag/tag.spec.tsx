import { render } from '@redesignhealth/shared-utils-jest'

import { TagRoot, TagLabel } from './tag'

describe('Tag', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<TagRoot><TagLabel>Test</TagLabel></TagRoot>)
    expect(baseElement).toBeTruthy()
  })
})
