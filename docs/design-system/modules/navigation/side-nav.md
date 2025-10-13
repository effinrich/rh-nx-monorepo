---
id: side-nav
category: navigation
title: SideNav
package: '@redesignhealth/ui'
description: SideNav is a composed component, or module, which provides an app wrapper to control layout, routing and mobile nav views.
---

# Side Nav

**_Note: This documentation is a work in progress_**

## Import

```js
import { SideNav } from '@redesignhealth/ui'
```

## Usage

SideNav is a composed component, or module, which provides an app wrapper to control layout, routing and mobile nav views.

```jsx
import { createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <ErrorBoundaryRoute />,
      children: [
        {
          index: true,
          element: <Dashboard />,
          errorElement: <ErrorBoundaryRoute />,
          loader: dashboardLoader
        },
        {
          path: 'op-cos',
          element: <OpCos />,
          errorElement: <ErrorBoundaryRoute />,
          loader: opcosLoader
        },
        {
          path: 'users',
          element: <Users />,
          errorElement: <ErrorBoundaryRoute />,
          loader: usersLoader
        }
      ]
    }
  ]
)

const onLogout = () => {
  return doLogoutLogic...
}

<SideNav router={router} logout={onLogout} />
```
