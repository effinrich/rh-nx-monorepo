import { LuChevronRight } from 'react-icons/lu'

import {
  BreadcrumbCurrentLink,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbRoot,
  BreadcrumbSeparator
} from '../breadcrumb'

export function WithCustomSeparatorBreadcrumb() {
  return (
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
}
