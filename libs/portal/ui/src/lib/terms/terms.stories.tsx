import {
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockRhUser
} from '@redesignhealth/portal/data-assets'
import { http, HttpResponse } from 'msw'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockRhUser)
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockRhUser)
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockEnterpriseBuyerUser)
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockEnterpriseBuyerUser)
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockEnterpriseSellerUser)
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
        http.get('/userinfo', () => {
          return HttpResponse.json(mockEnterpriseSellerUser)
        })
      ]
    }
  }
}
