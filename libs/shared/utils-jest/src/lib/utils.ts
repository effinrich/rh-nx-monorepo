import {
  act,
  fireEvent,
  screen,
  waitForElementToBeRemoved
} from '@testing-library/react'

export function queue(): Promise<void> {
  return act(() => Promise.resolve())
}

export function nextTick(): Promise<void> {
  return act(
    () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
  )
}

export async function sleep(ms = 16): Promise<void> {
  await act(() => new Promise(resolve => setTimeout(resolve, ms)))
  await nextTick()
}

export const waitForLoadingToFinish = () => {
  return waitForElementToBeRemoved(() => screen.queryAllByText('Loading...'))
}

/**
 * Opens a Chakra Combobox and selects an option by its accessible name.
 */
export const selectComboboxOption = async (
  combobox: HTMLElement,
  optionName: string
) => {
  fireEvent.focus(combobox)
  fireEvent.click(combobox)
  fireEvent.keyDown(combobox, {
    code: 'ArrowDown',
    key: 'ArrowDown'
  })
  const option = await screen.findByRole('option', { name: optionName })
  fireEvent.click(option)
  fireEvent.blur(combobox)
}

/**
 * Our react-hook-form resolver requires "onBlur" to occur before
 * validation occurs. This helper changes the input and fires "onBlur"
 * events.
 * @param input input to change
 * @param newValue new value for the input
 */
export const changeAndBlur = (input: HTMLElement, newValue: string) => {
  fireEvent.change(input, { target: { value: newValue } })
  fireEvent.blur(input)
}
