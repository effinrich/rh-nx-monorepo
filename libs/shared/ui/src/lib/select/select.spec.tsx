import { render, testA11y } from '@redesignhealth/shared-utils-jest'

import { FormControl } from '../form-control/form-control'

import { NativeSelectRoot, NativeSelectField } from './select'

test.skip('should pass a11y check', async () => {
  const { container } = render(
    <NativeSelectRoot>
      <NativeSelectField aria-label="Select Food" placeholder="Select an option">
        <option value="a">A</option>
        <option value="b">B</option>
        <option value="c">C</option>
      </NativeSelectField>
    </NativeSelectRoot>
  )
  await testA11y(container)
})

test('renders a placeholder option', () => {
  const { container } = render(
    <NativeSelectRoot>
      <NativeSelectField placeholder="Select an option" />
    </NativeSelectRoot>
  )
  const option = container.querySelector("option[value='']") as HTMLElement

  expect(option).toBeInTheDocument()
  expect(option).toHaveTextContent('Select an option')
})

test('renders in disabled state if disabled is true', () => {
  const { container } = render(
    <NativeSelectRoot disabled>
      <NativeSelectField placeholder="Select an option" />
    </NativeSelectRoot>
  )
  const select = container.querySelector('select') as HTMLElement
  expect(select).toBeDisabled()
})

test('doesnt render in disabled state if disabled is false', () => {
  const { container } = render(
    <NativeSelectRoot disabled={false}>
      <NativeSelectField placeholder="Select an option" />
    </NativeSelectRoot>
  )
  const select = container.querySelector('select') as HTMLElement
  expect(select).toBeEnabled()
})

test('renders in disabled state if wrapped by FormControl with disabled', () => {
  const { container } = render(
    <FormControl disabled>
      <NativeSelectRoot>
        <NativeSelectField placeholder="Select an option" />
      </NativeSelectRoot>
    </FormControl>
  )
  const select = container.querySelector('select') as HTMLElement
  expect(select).toBeDisabled()
})
