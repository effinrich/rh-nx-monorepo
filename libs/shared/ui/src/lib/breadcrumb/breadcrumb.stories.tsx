import { BrowserRouter, Link } from 'react-router-dom'
import { LuChevronRight } from 'react-icons/lu'

import {
  BreadcrumbCurrentLink,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbRoot,
  BreadcrumbSeparator
} from './breadcrumb'

export default {
  title: 'Components / Navigation / Breadcrumb',
  component: BreadcrumbRoot
}

export const Basic = () => (
  <BrowserRouter>
    <BreadcrumbRoot>
      <BreadcrumbList gap="4">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/home" replace>
              Breadcrumb 1
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#">Breadcrumb 2</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbCurrentLink>Breadcrumb 3</BreadcrumbCurrentLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  </BrowserRouter>
)

export const WithSeparator = () => (
  <BreadcrumbRoot>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="#">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="#">About</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbCurrentLink>Current</BreadcrumbCurrentLink>
      </BreadcrumbItem>
    </BreadcrumbList>
  </BreadcrumbRoot>
)

export const WithCustomSeparator = () => (
  <BreadcrumbRoot>
    <BreadcrumbList gap="8px">
      <BreadcrumbItem>
        <BreadcrumbLink href="/">Home</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <LuChevronRight color="gray.300" />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbLink href="/about">About</BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>
        <LuChevronRight color="gray.300" />
      </BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbCurrentLink>Contact</BreadcrumbCurrentLink>
      </BreadcrumbItem>
    </BreadcrumbList>
  </BreadcrumbRoot>
)
