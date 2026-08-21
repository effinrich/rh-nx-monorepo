import { render, screen, testA11y } from '@redesignhealth/shared-utils-jest'

import {
  BreadcrumbCurrentLink,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbRoot,
  BreadcrumbSeparator
} from './breadcrumb'

it('passes a11y test', async () => {
  await testA11y(
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Link 1</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Link 2</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbCurrentLink>Link 3</BreadcrumbCurrentLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
})

test('has the proper aria-attributes', () => {
  render(
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Link 1</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Link 2</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbCurrentLink>Link 3</BreadcrumbCurrentLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  )

  screen.getByLabelText('breadcrumb', { selector: 'nav' })

  const currentPageLink = screen.getByText('Link 3')
  expect(currentPageLink).toHaveAttribute('aria-current', 'page')
})

test('separator can be changed', () => {
  render(
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Link 1</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>-</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Link 2</BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
  expect(screen.getAllByText('-')).toHaveLength(1)
})

test('breadcrumb link has its href attribute correctly set', () => {
  render(
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Link 1</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbCurrentLink>Link 2</BreadcrumbCurrentLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
  const breadcrumbLink = screen.getByText('Link 1')
  expect(breadcrumbLink).toHaveAttribute('href', '#')
})

test("current page link doesn't have href attribute set", () => {
  render(
    <BreadcrumbRoot>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Link 1</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbCurrentLink>Link 2</BreadcrumbCurrentLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  )
  const currentPageLink = screen.getByText('Link 2')
  expect(currentPageLink).not.toHaveAttribute('href')
})
