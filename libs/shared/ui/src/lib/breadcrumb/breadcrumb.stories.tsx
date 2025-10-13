import { BrowserRouter, Link } from 'react-router-dom'
import { ChevronRightIcon } from '@chakra-ui/icons'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator
} from './breadcrumb'

export default {
  title: 'Components / Navigation / Breadcrumb',
  component: Breadcrumb
}

export const Basic = () => (
  <BrowserRouter>
    <Breadcrumb spacing="4">
      <BreadcrumbItem>
        <BreadcrumbLink as={Link} to="/home" replace>
          Breadcrumb 1
        </BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem>
        <BreadcrumbLink href="#">Breadcrumb 2</BreadcrumbLink>
      </BreadcrumbItem>

      <BreadcrumbItem isCurrentPage>
        <BreadcrumbLink href="#">Breadcrumb 3</BreadcrumbLink>
      </BreadcrumbItem>
    </Breadcrumb>
  </BrowserRouter>
)

export const WithSeparator = () => (
  <Breadcrumb>
    <BreadcrumbItem>
      <BreadcrumbLink href="#">Home</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem>
      <BreadcrumbLink href="#">About</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem isCurrentPage>
      <BreadcrumbLink href="#">Current</BreadcrumbLink>
      <BreadcrumbSeparator />
    </BreadcrumbItem>
  </Breadcrumb>
)

export const WithCustomSeparator = () => (
  <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.300" />}>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem>
      <BreadcrumbLink href="/about">About</BreadcrumbLink>
    </BreadcrumbItem>

    <BreadcrumbItem isCurrentPage>
      <BreadcrumbLink href="/contact">Contact</BreadcrumbLink>
    </BreadcrumbItem>
  </Breadcrumb>
)
