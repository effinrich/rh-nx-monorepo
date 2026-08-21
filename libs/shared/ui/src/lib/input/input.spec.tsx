import {
  mocks,
  render,
  screen,
  testA11y
} from '@redesignhealth/shared-utils-jest'

import { FieldRoot } from '../form-control/form-control'
import { Input, InputGroup } from './input'

describe('Input', () => {
  mocks.matchMedia('any', false)

  test('passes a11y test', async () => {
    await testA11y(<Input />, {
      axeOptions: {
        rules: {
          label: { enabled: false }
        }
      }
    })
  })

  test('Elements inside input render correctly', () => {
    render(
      <InputGroup
        startElement={<span>Hello</span>}
        endElement={<span>World</span>}
      >
        <Input />
      </InputGroup>
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('World')).toBeInTheDocument()
  })

  test('Invalid input renders correctly', () => {
    render(
      <FieldRoot invalid>
        <Input />
      </FieldRoot>
    )

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  test('Disabled input renders correctly', () => {
    render(<Input disabled />)

    expect(screen.getByRole('textbox')).toHaveAttribute('disabled')
  })

  test('Readonly input renders correctly', () => {
    render(<Input readOnly />)

    expect(screen.getByRole('textbox')).toHaveAttribute('readOnly')
  })

  test('Input with native size renders correctly', () => {
    render(<Input htmlSize={4} />)

    expect(screen.getByRole('textbox')).toHaveAttribute('size', '4')
  })
})
