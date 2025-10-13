import { render } from '@testing-library/react'

import { IconButton } from './icon-button'

describe('IconButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<IconButton aria-label="icon button" />)
    expect(baseElement).toBeTruthy()
  })
})
