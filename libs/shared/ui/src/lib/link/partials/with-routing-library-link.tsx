import { BrowserRouter, Link as ReactRouterLink } from 'react-router-dom'

import { Link } from '../link'

export function WithRoutingLibraryLink() {
  return (
    <BrowserRouter>
      <Link as={ReactRouterLink} to="/home" replace>
        Click me
      </Link>
    </BrowserRouter>
  )
}
