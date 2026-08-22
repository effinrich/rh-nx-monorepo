import { BrowserRouter, Link } from 'react-router-dom'

import {
  BreadcrumbCurrentLink,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbRoot,
  BreadcrumbSeparator
} from '../breadcrumb'

export function BasicBreadcrumb() {
  return (
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
}
