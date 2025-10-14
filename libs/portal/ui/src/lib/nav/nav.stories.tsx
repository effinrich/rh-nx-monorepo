import {
  mockAdminUser,
  mockCompanyUser,
  mockEnterpriseBuyerUser,
  mockEnterpriseSellerUser,
  mockInvalidEnterpriseBuyerAndSellerUser,
  mockIpListingWithUnreleasedIPRequest,
  mockIpMarketplaceWithRequests,
  mockRhUser,
  mockSuperAdminUser
} from '@redesignhealth/portal/data-assets'
import { rest } from 'msw'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import { Nav, NavProps } from './nav'

const Story: Meta<typeof Nav> = {
  component: Nav,
  title: 'components/Nav',
  decorators: [withRouter],
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/qSkYvu9sbnCKyLTqvZM5Wc/Design-Library%3A-Base-Components?type=design&node-id=610-13436&mode=dev'
    }
  }
}

export default Story

export const SuperAdminUser = {
  args: {
    userInfo: mockSuperAdminUser
  } as NavProps
}

export const AdminUser = {
  args: {
    userInfo: mockAdminUser
  } as NavProps
}

export const RhUser = {
  args: {
    userInfo: mockRhUser
  } as NavProps
}

export const CompanyUser = {
  args: {
    userInfo: mockCompanyUser
  } as NavProps
}

export const EnterpriseBuyerUser = {
  args: {
    userInfo: mockEnterpriseBuyerUser
  } as NavProps,
  parameters: {
    msw: {
      handlers: [
        rest.get('/ip-marketplace', (req, res, ctx) => {
          return res(ctx.json(mockIpMarketplaceWithRequests))
        })
      ]
    }
  }
}

export const EnterpriseSellerUser = {
  args: {
    userInfo: mockEnterpriseSellerUser
  } as NavProps,
  parameters: {
    msw: {
      handlers: [
        rest.get('/ip-marketplace', (req, res, ctx) => {
          return res(
            ctx.json({
              ...mockIpMarketplaceWithRequests,
              content: [
                {
                  ...mockIpListingWithUnreleasedIPRequest,
                  owner: {
                    email: 'sazh.katzroy@redesignhealth.com'
                  }
                }
              ]
            })
          )
        })
      ]
    }
  }
}

export const InvalidEnterpriseBuyerAndSellerUser = {
  args: {
    userInfo: mockInvalidEnterpriseBuyerAndSellerUser
  } as NavProps
}
