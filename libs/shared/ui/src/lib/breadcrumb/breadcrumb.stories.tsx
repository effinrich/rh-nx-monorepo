import { LuChevronRight } from 'react-icons/lu'
import { BrowserRouter, Link } from 'react-router-dom'

import { Breadcrumb } from './breadcrumb'

export default {
  title: 'Components / Navigation / Breadcrumb',
  component: Breadcrumb
}

export const Basic = () => (
  <BrowserRouter>
    <Breadcrumb.Root>
      <Breadcrumb.List gap="4">
        <Breadcrumb.Item>
          <Breadcrumb.Link asChild>
            <Link to="/home" replace>
              Breadcrumb 1
            </Link>
          </Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>

        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Breadcrumb 2</Breadcrumb.Link>
          <Breadcrumb.Separator />
        </Breadcrumb.Item>

        <Breadcrumb.Item>
          <Breadcrumb.CurrentLink>Breadcrumb 3</Breadcrumb.CurrentLink>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb.Root>
  </BrowserRouter>
)

export const WithSeparator = () => (
  <Breadcrumb.Root>
    <Breadcrumb.List>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
        <Breadcrumb.Separator />
      </Breadcrumb.Item>

      <Breadcrumb.Item>
        <Breadcrumb.Link href="#">About</Breadcrumb.Link>
        <Breadcrumb.Separator />
      </Breadcrumb.Item>

      <Breadcrumb.Item>
        <Breadcrumb.CurrentLink>Current</Breadcrumb.CurrentLink>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
)

export const WithCustomSeparator = () => (
  <Breadcrumb.Root>
    <Breadcrumb.List gap="8px">
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        <Breadcrumb.Separator>
          <LuChevronRight color="gray.300" />
        </Breadcrumb.Separator>
      </Breadcrumb.Item>

      <Breadcrumb.Item>
        <Breadcrumb.Link href="/about">About</Breadcrumb.Link>
        <Breadcrumb.Separator>
          <LuChevronRight color="gray.300" />
        </Breadcrumb.Separator>
      </Breadcrumb.Item>

      <Breadcrumb.Item>
        <Breadcrumb.CurrentLink>Contact</Breadcrumb.CurrentLink>
      </Breadcrumb.Item>
    </Breadcrumb.List>
  </Breadcrumb.Root>
)
