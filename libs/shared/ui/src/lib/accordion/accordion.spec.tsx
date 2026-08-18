import {
  focus,
  render,
  screen,
  testA11y
} from '@redesignhealth/shared-utils-jest'

import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent
} from './index'

test('passes a11y test', async () => {
  await testA11y(
    <AccordionRoot>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>Section 1 title</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
})

test('uncontrolled: It opens the accordion panel', async () => {
  render(
    <AccordionRoot defaultValue={['a']}>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger data-testid="button">
            Section 1 title
          </AccordionItemTrigger>
        </h2>
        <AccordionItemContent data-testid="panel">Panel 1</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )

  expect(screen.getByTestId('button')).toHaveAttribute('aria-expanded', 'true')
})

test('uncontrolled: toggles the accordion on click', async () => {
  const { user } = render(
    <AccordionRoot>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>Trigger</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )

  const trigger = screen.getByText('Trigger')

  await user.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')

  await user.click(trigger)
  expect(trigger).toHaveAttribute('aria-expanded', 'true')
})

test('arrow up & down moves focus to next/previous accordion', async () => {
  const { user } = render(
    <AccordionRoot>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>Section 1 title</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="b">
        <AccordionItemTrigger>Section 2 title</AccordionItemTrigger>
        <AccordionItemContent>Panel 2</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
  const first = screen.getByText('Section 1 title')
  const second = screen.getByText('Section 2 title')

  focus(first)

  await user.keyboard('[ArrowDown]')
  expect(second).toHaveFocus()

  await user.keyboard('[ArrowUp]')
  expect(first).toHaveFocus()
})

test('home & end keys moves focus to first/last accordion', async () => {
  const { user } = render(
    <AccordionRoot>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>First section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="b">
        <h2>
          <AccordionItemTrigger>Second section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="c">
        <h2>
          <AccordionItemTrigger>Last section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 2</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
  const first = screen.getByText('First section')
  const last = screen.getByText('Last section')

  focus(first)

  await user.keyboard('[Home]')
  expect(first).toHaveFocus()

  await user.keyboard('[End]')
  expect(last).toHaveFocus()
})

test('only one accordion can be visible + is not toggleable', async () => {
  const { user } = render(
    <AccordionRoot>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>First section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="b">
        <h2>
          <AccordionItemTrigger>Second section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )

  const first = screen.getByText('First section')

  await user.click(first)
  expect(first).toHaveAttribute('aria-expanded', 'true')

  await user.click(first)
  expect(first).toHaveAttribute('aria-expanded', 'true')
})

test('only one accordion can be visible + is toggleable', async () => {
  const { user } = render(
    <AccordionRoot collapsible>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>First section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="b">
        <h2>
          <AccordionItemTrigger>Second section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )

  const firstAccordion = screen.getByText('First section')

  await user.click(firstAccordion)
  expect(firstAccordion).toHaveAttribute('aria-expanded', 'true')

  await user.click(firstAccordion)
  expect(firstAccordion).toHaveAttribute('aria-expanded', 'false')
})

test('multiple accordions can be opened + is toggleable', async () => {
  const { user } = render(
    <AccordionRoot multiple>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>First section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="b">
        <h2>
          <AccordionItemTrigger>Second section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )

  const first = screen.getByText('First section')
  const second = screen.getByText('Second section')

  await user.click(first)
  expect(first).toHaveAttribute('aria-expanded', 'true')

  await user.click(second)
  expect(first).toHaveAttribute('aria-expanded', 'true')
})

test('has the proper aria attributes', async () => {
  render(
    <AccordionRoot defaultValue={['a']}>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>Section 1 title</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
  const button = screen.getByText('Section 1 title')
  const panel = screen.getByText('Panel 1')

  expect(button).toHaveAttribute('aria-controls')
  expect(button).toHaveAttribute('aria-expanded')
  expect(panel).toHaveAttribute('aria-labelledby')
})

test('tab moves focus to the next focusable element', async () => {
  const { user } = render(
    <AccordionRoot>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>First section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="b">
        <h2>
          <AccordionItemTrigger>Second section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>

      <AccordionItem value="c">
        <h2>
          <AccordionItemTrigger>Last section</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 2</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
  const first = screen.getByText('First section')
  const second = screen.getByText('Second section')
  const last = screen.getByText('Last section')

  await user.keyboard('[Tab]')
  expect(first).toHaveFocus()

  await user.keyboard('[Tab]')
  expect(second).toHaveFocus()

  await user.keyboard('[Tab]')
  expect(last).toHaveFocus()
})

test('aria-controls for button is same as id for panel', async () => {
  render(
    <AccordionRoot defaultValue={['a']}>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>Section 1 title</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
  const button = screen.getByText('Section 1 title')
  const panel = screen.getByText('Panel 1')
  expect(button.getAttribute('aria-controls')).toEqual(panel.getAttribute('id'))
})

test('aria-expanded is true/false when accordion is open/closed', async () => {
  render(
    <AccordionRoot defaultValue={['a']}>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>Section 1 title</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>
      <AccordionItem value="b">
        <h2>
          <AccordionItemTrigger>Section 2 title</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 2</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )

  const button = screen.getByText('Section 1 title')
  expect(button).toHaveAttribute('aria-expanded', 'true')
})

test('panel has role=region and aria-labelledby', async () => {
  render(
    <AccordionRoot defaultValue={['a']}>
      <AccordionItem value="a">
        <h2>
          <AccordionItemTrigger>Section 1 title</AccordionItemTrigger>
        </h2>
        <AccordionItemContent>Panel 1</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
  const panel = screen.getByText('Panel 1')

  expect(panel).toHaveAttribute('aria-labelledby')
  expect(panel).toHaveAttribute('role', 'region')
})
