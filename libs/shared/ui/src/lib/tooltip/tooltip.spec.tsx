import {
  act,
  fireEvent,
  render,
  screen,
  testA11y,
  waitFor
} from '@redesignhealth/shared-utils-jest'

import {
  TooltipRoot,
  TooltipTrigger,
  TooltipContent,
  TooltipPositioner
} from './tooltip'
import type { TooltipRootProps } from './tooltip'

const buttonLabel = 'Hover me'
const tooltipLabel = 'tooltip label'

const DummyComponent = (
  props: Partial<TooltipRootProps> & { isButtonDisabled?: boolean; shouldWrapChildren?: boolean }
) => {
  const { isButtonDisabled, shouldWrapChildren, ...tooltipProps } = props
  return (
    <TooltipRoot {...tooltipProps}>
      <TooltipTrigger asChild>
        {shouldWrapChildren ? (
          <span>
            <button disabled={isButtonDisabled || false}>{buttonLabel}</button>
          </span>
        ) : (
          <button disabled={isButtonDisabled || false}>{buttonLabel}</button>
        )}
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>{tooltipLabel}</TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}

test.skip('passes a11y test when hovered', async () => {
  render(<DummyComponent />)

  fireEvent.pointerOver(screen.getByText(buttonLabel))

  const tooltip = await screen.findByRole('tooltip')

  await testA11y(tooltip)
})

test.skip('shows on pointerover and closes on pointerleave', async () => {
  render(<DummyComponent />)

  fireEvent.pointerOver(screen.getByText(buttonLabel))

  await screen.findByRole('tooltip')

  expect(screen.getByText(buttonLabel)).toBeInTheDocument()
  expect(screen.getByRole('tooltip')).toBeInTheDocument()

  fireEvent.pointerLeave(screen.getByText(buttonLabel))

  await waitFor(() =>
    expect(screen.queryByText(tooltipLabel)).not.toBeInTheDocument()
  )
})

test('should not show on pointerover if isDisabled is true', async () => {
  jest.useFakeTimers()

  render(<DummyComponent disabled />)

  fireEvent.pointerOver(screen.getByText(buttonLabel))

  act(() => {
    jest.advanceTimersByTime(200)
  })

  expect(screen.queryByText(tooltipLabel)).not.toBeInTheDocument()

  jest.useRealTimers()
})

test.skip('should close on pointerleave if openDelay is set', async () => {
  jest.useFakeTimers()

  render(<DummyComponent openDelay={500} />)

  fireEvent.pointerOver(screen.getByText(buttonLabel))

  act(() => {
    jest.advanceTimersByTime(200)
  })
  expect(screen.queryByText(tooltipLabel)).not.toBeInTheDocument()

  act(() => {
    jest.advanceTimersByTime(500)
  })
  expect(screen.getByText(tooltipLabel)).toBeInTheDocument()

  fireEvent.pointerLeave(screen.getByText(buttonLabel))

  act(() => {
    jest.advanceTimersByTime(200)
  })

  await waitFor(() =>
    expect(screen.queryByText(tooltipLabel)).not.toBeInTheDocument()
  )

  jest.useRealTimers()
})

test.skip('should show on pointerover if isDisabled has a falsy value', async () => {
  render(<DummyComponent disabled={false} />)

  fireEvent.pointerOver(screen.getByText(buttonLabel))

  await screen.findByRole('tooltip')

  expect(screen.getByText(buttonLabel)).toBeInTheDocument()
})

test.skip('should close on pointerleave if shouldWrapChildren is true and child is a disabled element', async () => {
  render(<DummyComponent shouldWrapChildren isButtonDisabled />)

  fireEvent.pointerEnter(screen.getByText(buttonLabel))

  await screen.findByRole('tooltip')

  const wrapper = screen.getByText(buttonLabel).parentElement
  expect(wrapper).toBeInTheDocument()

  fireEvent.pointerLeave(wrapper!)

  await waitFor(() =>
    expect(screen.queryByText(tooltipLabel)).not.toBeInTheDocument()
  )
})

test.skip("shows on pointerover and closes on pressing 'esc'", async () => {
  const { user } = render(<DummyComponent />)

  fireEvent.pointerOver(screen.getByText(buttonLabel))

  await screen.findByRole('tooltip')

  expect(screen.getByText(buttonLabel)).toBeInTheDocument()
  expect(screen.getByRole('tooltip')).toBeInTheDocument()

  await user.keyboard('[Escape]')

  await waitFor(() =>
    expect(screen.queryByText(tooltipLabel)).not.toBeInTheDocument()
  )
})

test.skip("shows on pointerover and stays on pressing 'esc' if 'closeOnEsc' is false", async () => {
  const { user } = render(<DummyComponent closeOnEsc={false} />)

  fireEvent.pointerOver(screen.getByText(buttonLabel))

  await screen.findByRole('tooltip')

  expect(screen.getByText(buttonLabel)).toBeInTheDocument()
  expect(screen.getByRole('tooltip')).toBeInTheDocument()

  await user.keyboard('[Escape]')

  expect(screen.getByRole('tooltip')).toBeInTheDocument()
})

test.skip('does not show tooltip after delay when `isDisabled` prop changes to `true`', async () => {
  jest.useFakeTimers()

  const { rerender } = render(
    <DummyComponent openDelay={100} disabled={false} />
  )

  fireEvent.pointerOver(screen.getByText(buttonLabel))

  act(() => {
    jest.advanceTimersByTime(50)
  })

  rerender(<DummyComponent openDelay={100} disabled={true} />)

  act(() => {
    jest.advanceTimersByTime(100)
  })

  expect(screen.queryByText(tooltipLabel)).not.toBeInTheDocument()

  jest.useRealTimers()
})

test.skip('should call onClose prop on pointerleave', async () => {
  const onClose = jest.fn()

  render(<DummyComponent onExitComplete={onClose} />)

  fireEvent.pointerOver(screen.getByText(buttonLabel))

  await screen.findByRole('tooltip')

  expect(screen.getByRole('tooltip')).toBeInTheDocument()
  expect(onClose).not.toHaveBeenCalled()

  fireEvent.pointerLeave(screen.getByText(buttonLabel))

  await waitFor(() => expect(onClose).toBeCalledTimes(1))
})
