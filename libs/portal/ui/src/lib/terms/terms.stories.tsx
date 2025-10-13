import {
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockRhUser
} from '@redesignhealth/portal/data-assets'
import { rest } from 'msw'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react'

import Terms from './terms'

const Story: Meta<typeof Terms> = {
  component: Terms,
  title: 'components/Terms',
  decorators: [withRouter],
  args: {
    isOpen: true
  }
}

export default Story

export const RhUserFirstTime = {
  args: {
    isAskingConsent: true
  },
  parameters: {
    msw: {
      handlers: [
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockRhUser))
        })
      ]
    }
  }
}

export const RhUserViewing = {
  args: {
    isAskingConsent: false
  },
  parameters: {
    msw: {
      handlers: [
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockRhUser))
        })
      ]
    }
  }
}

export const CompanyBuyerFirstTime = {
  args: {
    isAskingConsent: true
  },
  parameters: {
    msw: {
      handlers: [
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockEnterpriseBuyerUser))
        })
      ]
    }
  }
}

export const CompanyBuyerViewing = {
  args: {
    isAskingConsent: false
  },
  parameters: {
    msw: {
      handlers: [
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockEnterpriseBuyerUser))
        })
      ]
    }
  }
}

export const CompanySellerFirstTime = {
  args: {
    isAskingConsent: true
  },
  parameters: {
    msw: {
      handlers: [
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockEnterpriseSellerUser))
        })
      ]
    }
  }
}

export const CompanySellerViewing = {
  args: {
    isAskingConsent: false
  },
  parameters: {
    msw: {
      handlers: [
        rest.get('/userinfo', (req, res, ctx) => {
          return res(ctx.json(mockEnterpriseSellerUser))
        })
      ]
    }
  }
}
