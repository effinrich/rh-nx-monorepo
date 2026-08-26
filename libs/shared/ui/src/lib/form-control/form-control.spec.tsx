import { render } from '@testing-library/react'

import { RhProvider } from '../rh-provider/rh-provider'

import { FieldRoot } from './form-control'

describe('Field', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<FieldRoot />, {
      wrapper: ({ children }) => <RhProvider>{children}</RhProvider>
    })
    expect(baseElement).toBeTruthy()
  })
})
