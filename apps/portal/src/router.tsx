import {
  createBrowserRouter,
  createRoutesFromElements,
  Route
} from 'react-router-dom'
import { getUserInfo } from '@redesignhealth/portal/data-assets'
import { EnvironmentDetails } from '@redesignhealth/portal/features/admin'
import {
  AddCeo,
  CeoDirectory,
  CeoOnboarding,
  CeoOnboardingSuccess,
  CeoProfileDetails,
  EditCeo
} from '@redesignhealth/portal/features/ceo-directory'
import {
  AddCompany,
  AddMarketplaceCompany,
  Companies,
  CompanyDetails,
  CompanyExpertNetwork,
  CompanyIpListing,
  CompanyUsers,
  CompanyVendors,
  EditCompany,
  EditMarketplaceCompany
} from '@redesignhealth/portal/features/companies'
import {
  IpListing,
  IpListingDetails,
  IpMarketplace,
  MyRequests
} from '@redesignhealth/portal/features/ip-marketplace'
import { Library } from '@redesignhealth/portal/features/library'
import {
  AddCallNote,
  AddResearchSprint,
  ResearchHub
} from '@redesignhealth/portal/features/research-hub'
import { SignIn } from '@redesignhealth/portal/features/sign-in'
import { Support } from '@redesignhealth/portal/features/support'
import { AddUser, EditUser } from '@redesignhealth/portal/features/users'
import {
  AddCompanyVendor,
  AddVendor,
  EditCompanyVendor,
  EditVendor,
  VendorDetails,
  Vendors
} from '@redesignhealth/portal/features/vendors'
import {
  CallNotes,
  ExternalContent,
  IpListingIpDetails,
  IpListingRequests,
  ResearchSprints
} from '@redesignhealth/portal/ui'
import { logout } from '@redesignhealth/portal/utils'
import { RootBoundary } from '@redesignhealth/ui'

import { directQueryClient } from './api/react-query'
import {
  CompanyInfra,
  CompanyInfraAction
} from './routes/dashboard/companies/company-details/infrastructure/index'
import {
  CompanyInfraPrivacy,
  CompanyInfraPrivacyAction
} from './routes/dashboard/companies/company-details/infrastructure/privacy/index'
import {
  CompanyInfraTechStack,
  CompanyInfraTechStackAction
} from './routes/dashboard/companies/company-details/infrastructure/tech-stack/index'
import { CompanyDetailsOverview } from './routes/dashboard/companies/company-details/overview/index'
import { DevLibrary } from './routes/dashboard/dev-library'
import { Dashboard } from './routes/dashboard/index'
import { Layout } from './routes/dashboard/layout'
import { Module } from './routes/dashboard/library/solution/module/module'
import { Solution } from './routes/dashboard/library/solution/solution'
import { Users } from './routes/dashboard/users/index'

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<RootBoundary logout={logout} />}>
      {/* App routes */}
      <Route path="sign-in" element={<SignIn />} />

      <Route
        element={<Layout />}
        id="dashboard-layout"
        loader={async () => {
          return getUserInfo()
        }}
      >
        <Route path="/" element={<Dashboard />}>
          <Route path="add-company" element={<AddCompany />} />
          <Route path="add-user" element={<AddUser />} />
        </Route>

        <Route path="support" element={<Support />} />
        <Route
          path="library"
          element={
            <Library
              libraryId={
                import.meta.env.VITE_PORTAL_LIBRARY_ID || 'MISSING_LIBRARY_ID'
              }
            />
          }
        />
        <Route
          path="library/:solutionId"
          element={<Solution libraryRoute="library" />}
        >
          <Route
            path="module/:moduleId"
            element={
              <Module
                libraryId={
                  import.meta.env.VITE_PORTAL_LIBRARY_ID || 'MISSING_LIBRARY_ID'
                }
                libraryRoute="library"
              />
            }
          />
        </Route>
        <Route
          path="dev-library"
          element={
            <DevLibrary
              libraryId={
                import.meta.env.VITE_PORTAL_DEVELOPER_LIBRARY_ID ||
                'MISSING_DEVELOPER_LIBRARY_ID'
              }
              libraryRoute="dev-library"
            />
          }
        />
        <Route
          path="dev-library/:solutionId"
          element={<Solution libraryRoute="dev-library" />}
        >
          <Route
            path="module/:moduleId"
            element={
              <Module
                libraryId={
                  import.meta.env.VITE_PORTAL_DEVELOPER_LIBRARY_ID ||
                  'MISSING_DEVELOPER_LIBRARY_ID'
                }
                libraryRoute="dev-library"
              />
            }
          />
        </Route>
        <Route path="companies" element={<Companies />}>
          <Route path="add-company" element={<AddCompany />} />
          <Route path=":companyId/edit" element={<EditCompany />} />
        </Route>
        <Route
          path="companies/add-marketplace-company"
          element={<AddMarketplaceCompany />}
        />
        <Route
          path="companies/:companyId/edit-marketplace-company"
          element={<EditMarketplaceCompany />}
        />
        <Route
          path="companies/:companyId"
          element={<CompanyDetails />}
          id="company-details-layout"
        >
          <Route path="overview" element={<CompanyDetailsOverview />} />
          <Route path="overview/edit" element={<EditCompany />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users" element={<CompanyUsers />} />
          <Route path="all-ip" element={<CompanyIpListing />} />
          <Route path="infrastructure">
            <Route
              index
              element={<CompanyInfra />}
              action={CompanyInfraAction(directQueryClient())}
            />
            <Route
              path="privacy"
              element={<CompanyInfraPrivacy />}
              action={CompanyInfraPrivacyAction(directQueryClient())}
            />

            <Route
              path="tech-stack"
              element={<CompanyInfraTechStack />}
              action={CompanyInfraTechStackAction(directQueryClient())}
            />
          </Route>

          <Route path="vendors" element={<CompanyVendors />} />
          <Route path="expert-network" element={<CompanyExpertNetwork />} />
        </Route>
        <Route
          path="companies/:companyId/vendors/add"
          element={<AddCompanyVendor />}
        />
        <Route
          path="companies/:companyId/vendors/:companyVendorId/edit"
          element={<EditCompanyVendor />}
        />
        <Route path="users" element={<Users />}>
          <Route path="add-user" element={<AddUser />} />
          <Route path="edit-user/:email" element={<EditUser />} />
        </Route>
        <Route path="research-hub" element={<ResearchHub />}>
          <Route path="research-sprints" element={<ResearchSprints />} />
          <Route path="call-notes" element={<CallNotes />} />
          <Route path="external-content" element={<ExternalContent />} />
        </Route>
        <Route
          path="research-hub/research-sprints/add"
          element={<AddResearchSprint />}
        />
        <Route path="research-hub/call-notes/add" element={<AddCallNote />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="vendors/add-vendor" element={<AddVendor />} />
        <Route path="vendors/:vendorId" element={<VendorDetails />} />
        <Route path="vendors/:vendorId/edit" element={<EditVendor />} />
        <Route path="ip-marketplace" element={<IpMarketplace />} />
        <Route
          path="ip-marketplace/:ipListingId"
          element={<IpListingDetails />}
        >
          <Route path="ip-details" element={<IpListingIpDetails />} />
          <Route path="requests" element={<IpListingRequests />} />
        </Route>
        <Route path="ip-listings" element={<IpListing />} />
        <Route path="my-requests" element={<MyRequests />} />
        <Route path="ceo-directory" element={<CeoDirectory />} />
        <Route path="ceo-directory/add" element={<AddCeo />} />
        <Route path="ceo-directory/onboarding" element={<CeoOnboarding />} />
        <Route
          path="ceo-directory/onboarding/success"
          element={<CeoOnboardingSuccess />}
        />
        <Route path="ceo-directory/:ceoId" element={<CeoProfileDetails />} />
        <Route path="ceo-directory/:ceoId/edit" element={<EditCeo />} />
        <Route path="environment" element={<EnvironmentDetails />} />
      </Route>
    </Route>
  )
)
