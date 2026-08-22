import {
  Filters,
  Ceo,
  mockAdminUser,
  mockCEOCompanyUser,
  mockCeoFilters,
  mockCeos,
  mockCeosNoResults,
  mockRhUser,
  PagedResult,
  UserInfoSummary
} from '@redesignhealth/portal/data-assets'
import { http, HttpResponse } from 'msw'
import { withRouter } from 'storybook-addon-remix-react-router'

import type { Meta } from '@storybook/react-vite'

import { CeoDirectoryPage } from './ceo-directory-page'

const Story: Meta<typeof CeoDirectoryPage> = {
  component: CeoDirectoryPage,
  title: 'pages/ CEO Directory Page',
  decorators: [withRouter],
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/1cqLgV2msm7pZlx8yg2xwa/Platform-SSOT%3A-CEO-Directory?type=design&node-id=902-141501&mode=dev'
    },
    msw: {
      handlers: [
        http.get('/ceos/filters', () => {
          return HttpResponse.json(mockCeoFilters)
        }),
        http.get('/ceos', () => {
          return HttpResponse.json(mockCeos)
        }),
        http.get('/userinfo', () => {
          return HttpResponse.json(mockCEOCompanyUser)
        })
      ]
    }
  }
}

export default Story

export const CEOCompanyUserOptIn = {
  args: {
    isCeoOptOut: false,
    ceoId: 'abc123'
  }
}

export const CEOCompanyUserOptOut = {
  args: {
    isCeoOptOut: true,
    ceoId: 'abc123'
  }
}

export const AdminUser = {
  args: {
    isCeoOptOut: false
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/ceos', () => {
          return HttpResponse.json(mockCeos)
        }),
        http.get('/userinfo', () => {
          return HttpResponse.json(mockAdminUser)
        })
      ]
    }
  }
}

export const RHUser = {
  args: {
    isCeoOptOut: false
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/ceos', () => {
          return HttpResponse.json(mockCeos)
        }),
        http.get('/userinfo', () => {
          return HttpResponse.json(mockRhUser)
        })
      ]
    }
  }
}

export const NoResultsFound = {
  args: {
    isCeoOptOut: false
  },
  parameters: {
    msw: {
      handlers: [
        http.get('/ceos', () => {
          return HttpResponse.json(mockCeosNoResults)
        })
      ]
    }
  }
}
