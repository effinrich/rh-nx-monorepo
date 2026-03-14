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
import { rest } from 'msw'
import { withRouter } from 'storybook-addon-react-router-v6'

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
        rest.get(
          '/ceos/filters',
          (
            req: any,
            res: (arg0: any) => any,
            ctx: { json: (arg0: Filters) => any }
          ) => {
            return res(ctx.json(mockCeoFilters))
          }
        ),
        rest.get(
          '/ceos',
          (
            req: any,
            res: (arg0: any) => any,
            ctx: { json: (arg0: PagedResult<Ceo>) => any }
          ) => {
            return res(ctx.json(mockCeos))
          }
        ),
        rest.get(
          '/userinfo',
          (
            req: any,
            res: (arg0: any) => any,
            ctx: { json: (arg0: UserInfoSummary) => any }
          ) => {
            return res(ctx.json(mockCEOCompanyUser))
          }
        )
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
        rest.get(
          '/ceos',
          (
            req: any,
            res: (arg0: any) => any,
            ctx: { json: (arg0: PagedResult<Ceo>) => any }
          ) => {
            return res(ctx.json(mockCeos))
          }
        ),
        rest.get(
          '/userinfo',
          (
            req: any,
            res: (arg0: any) => any,
            ctx: { json: (arg0: UserInfoSummary) => any }
          ) => {
            return res(ctx.json(mockAdminUser))
          }
        )
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
        rest.get(
          '/ceos',
          (
            req: any,
            res: (arg0: any) => any,
            ctx: { json: (arg0: PagedResult<Ceo>) => any }
          ) => {
            return res(ctx.json(mockCeos))
          }
        ),
        rest.get(
          '/userinfo',
          (
            req: any,
            res: (arg0: any) => any,
            ctx: { json: (arg0: UserInfoSummary) => any }
          ) => {
            return res(ctx.json(mockRhUser))
          }
        )
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
        rest.get(
          '/ceos',
          (
            req: any,
            res: (arg0: any) => any,
            ctx: { json: (arg0: PagedResult<Ceo>) => any }
          ) => {
            return res(ctx.json(mockCeosNoResults))
          }
        )
      ]
    }
  }
}
