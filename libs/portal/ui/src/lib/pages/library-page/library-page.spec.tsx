import { mocks, render } from '@redesignhealth/shared-utils-jest'

import LibraryPage from './library-page'

describe('Library Page', () => {
  it('should render successfully', () => {
    mocks.matchMedia('any', false)
    const { baseElement } = render(<LibraryPage categoryGroupings={[]} />)
    expect(baseElement).toBeTruthy()
  })
})
