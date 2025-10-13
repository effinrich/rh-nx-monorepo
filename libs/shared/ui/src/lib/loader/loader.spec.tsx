import { render } from '@redesignhealth/shared-utils-jest'

import { Loader } from './loader'

describe('Loader', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Loader />)
    expect(baseElement).toBeTruthy()
  })

  it('should render with props', () => {
    const { baseElement } = render(
      <Loader
        size="md"
        color="primary.600"
        thickness="4px"
        speed="0.65s"
        minH="25vh"
      />
    )
    expect(baseElement).toBeTruthy()
  })
})
