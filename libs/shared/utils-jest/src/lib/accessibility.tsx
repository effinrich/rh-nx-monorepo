import '@testing-library/jest-dom'

import * as React from 'react'
import { RenderOptions } from '@testing-library/react'
import { axe, JestAxeConfigureOptions, toHaveNoViolations } from 'jest-axe'

import { render } from './render'

expect.extend(toHaveNoViolations)

export async function testA11y(
  ui: React.ReactElement | HTMLElement,
  options: RenderOptions & { axeOptions?: JestAxeConfigureOptions } = {}
) {
  const { axeOptions, ...rest } = options
  let container: Element
  if (React.isValidElement(ui)) {
    const element = React.cloneElement(ui as React.ReactElement, {
      ...rest
    })
    container = render(element).container
  } else {
    container = document.createElement('div')
    container.innerHTML = ui as unknown as string
  }
  const results = await axe(container, axeOptions)
  expect(results).toHaveNoViolations()
}
