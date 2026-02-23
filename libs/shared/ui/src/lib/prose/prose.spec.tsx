import { render } from '@redesignhealth/shared-utils-jest'

import { Prose } from './prose'

describe('Prose', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Prose>Content</Prose>)
    expect(baseElement).toBeTruthy()
  })

  it('should apply chakra-prose class', () => {
    const { container } = render(<Prose>Content</Prose>)
    expect(container.firstChild).toHaveClass('chakra-prose')
  })

  it('should render children', () => {
    const { getByText } = render(
      <Prose>
        <p>Hello world</p>
      </Prose>
    )
    expect(getByText('Hello world')).toBeInTheDocument()
  })
})
