import { render, screen } from '@redesignhealth/shared-utils-jest'

import { Prose } from './prose'

describe('Prose', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Prose>Content</Prose>)
    expect(baseElement).toBeTruthy()
  })

  it('should apply chakra-prose class', () => {
    const { container } = render(<Prose>Content</Prose>)
    expect(container.querySelector('.chakra-prose')).toBeInTheDocument()
  })

  it('should render children', () => {
    render(
      <Prose>
        <p>Hello world</p>
      </Prose>
    )
    expect(screen.getByText('Hello world')).toBeInTheDocument()
  })
})
