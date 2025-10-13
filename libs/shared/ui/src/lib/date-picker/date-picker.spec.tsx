import { render } from '@testing-library/react'

import DatePicker from './date-picker'

describe('DatePicker', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <DatePicker
        onChange={function (date: Date): void {
          throw new Error('Function not implemented.')
        }}
        selected={undefined}
      />
    )
    expect(baseElement).toBeTruthy()
  })
})
