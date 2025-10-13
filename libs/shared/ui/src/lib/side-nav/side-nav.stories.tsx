import { createBrowserRouter } from 'react-router-dom'
import { withRouter } from 'storybook-addon-react-router-v6'

import { Meta } from '@storybook/react'

import RootBoundary from '../root-boundary/root-boundary'

import Dashboard, {
  loader as dashboardLoader
} from './mock-routes/dashboard/dashboard'
import OpCos, { loader as opcosLoader } from './mock-routes/op-cos/op-cos'
import Users, { loader as usersLoader } from './mock-routes/users/users'
import { SideNav } from './index'

const App = () => <div>I'm a dummy app</div>

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      errorElement: <RootBoundary />,
      children: [
        {
          index: true,
          element: <Dashboard />,
          errorElement: <RootBoundary />,
          loader: dashboardLoader
        },
        {
          path: 'op-cos',
          element: <OpCos />,
          errorElement: <RootBoundary />,
          loader: opcosLoader
        },
        {
          path: 'users',
          element: <Users />,
          errorElement: <RootBoundary />,
          loader: usersLoader
        }
      ]
    }
  ],
  {
    basename:
      '/iframe.html?viewMode=story&id=modules-navigation-side-nav--default'
  }
)

export default {
  component: SideNav,
  title: 'Modules / Navigation / Side Nav',
  args: {
    router,
    userProfile: {
      email: 'richard.tillman@redesignhealth.com',
      picture:
        'https://lh3.googleusercontent.com/a/ALm5wu3xqiIM7DBR3gV5QZF_1J3NWa5asPvc1l1Z0EKD=s96-c',
      links: [
        {
          rel: 'self',
          href: 'https://company-api.dev.redesignhealth.com/person/richard.tillman@redesignhealth.com'
        }
      ],
      givenName: 'Rich',
      familyName: 'Tillman'
    },
    numPersons: 13,
    numOpcos: 10
  },
  decorators: [withRouter],
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen'
  }
  // decorators: [(story: any) => <RouterProvider router={router} />]
} as Meta<typeof SideNav>

export const Default = {
  args: {
    userProfile: {
      email: 'richard.tillman@redesignhealth.com',
      picture:
        'https://lh3.googleusercontent.com/a/ALm5wu3xqiIM7DBR3gV5QZF_1J3NWa5asPvc1l1Z0EKD=s96-c',
      links: [
        {
          rel: 'self',
          href: 'https://company-api.dev.redesignhealth.com/person/richard.tillman@redesignhealth.com'
        }
      ],
      givenName: 'Rich',
      familyName: 'Tillman'
    },
    numPersons: 13,
    numOpcos: 10
  }
}
