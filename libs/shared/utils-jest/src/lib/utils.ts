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
 * Helper to change react-select option
 * More info: https://stackoverflow.com/a/56183912
 *
 */
export const selectReactSelectOption = async (
  select: HTMLElement,
  optionName: string
) => {
  const ARROW_DOWN = 40
  fireEvent.focus(select)
  fireEvent.keyDown(select, {
    keyCode: ARROW_DOWN
  })
  const option = await screen.findByText(optionName)
  fireEvent.click(option)
  fireEvent.blur(select)
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
