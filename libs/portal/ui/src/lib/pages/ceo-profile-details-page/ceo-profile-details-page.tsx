import { MdInfoOutline } from 'react-icons/md'
import {
  Link as LinkType,
  RoleAuthorityEnum
} from '@redesignhealth/portal/data-assets'
import { Flex, Icon, Text, Tooltip } from '@redesignhealth/ui'

import DetailsCard from '../../details-card/details-card'
import DetailsCardBody from '../../details-card/details-card-body'
import DetailsCardRow from '../../details-card/details-card-row'
import DetailsCardRowLink from '../../details-card/details-card-row-link'
import { ListCardTags } from '../../list-card/list-card-tags'
import Page from '../../page/page'

import CeoProfileHeader from './partials/ceo-profile-header'

export interface CeoProfileDetailsPageProps {
  name: string
  isSameUser: boolean
  email?: string
  location?: string
  biography?: string
  pictureHref?: string
  company?: LinkType
  companyDescription?: string
  companyFundraiseStatus?: string
  customerSegments?: Array<string>
  linkedInProfileHref?: string
  healthcareSector?: string
  marketServiceArea?: Array<string>
  isOptIn?: boolean
  businessFocusArea?: Array<string>
  businessType?: string
  additionalInfo?: string
  currentRole?: RoleAuthorityEnum
}

export const CeoProfileDetailsPage = ({
  name,
  email,
  location,
  biography,
  pictureHref,
  company,
  companyDescription,
  companyFundraiseStatus,
  customerSegments,
  linkedInProfileHref,
  healthcareSector,
  marketServiceArea,
  isOptIn,
  businessFocusArea,
  businessType,
  additionalInfo,
  isSameUser,
  currentRole
}: CeoProfileDetailsPageProps) => {
  return (
    <Page>
      <DetailsCard>
        <CeoProfileHeader
          name={name}
          email={email}
          location={location}
          pictureHref={pictureHref}
          isSameUser={isSameUser}
          isOptIn={isOptIn}
          currentRole={currentRole}
        />
        <DetailsCardBody>
          <DetailsCardRow title="Company">
            <Flex gap="2">
              {company?.href ? (
                <DetailsCardRowLink href={company.href} name={company.name} />
              ) : (
                company?.name
              )}

              {companyDescription && (
                <Tooltip hasArrow label={companyDescription} placement="right">
                  <span>
                    <Icon as={MdInfoOutline} boxSize={6} color="gray.500" />
                  </span>
                </Tooltip>
              )}
            </Flex>
          </DetailsCardRow>
          <DetailsCardRow title="Fundraising stage">
            {companyFundraiseStatus}
          </DetailsCardRow>
          <DetailsCardRow title="Business type">{businessType}</DetailsCardRow>
          <DetailsCardRow title="Customer segment">
            <ListCardTags values={customerSegments} />
          </DetailsCardRow>
          <DetailsCardRow title="Healthcare sector">
            {healthcareSector}
          </DetailsCardRow>
          <DetailsCardRow title="Business focus area">
            <ListCardTags values={businessFocusArea} />
          </DetailsCardRow>
          <DetailsCardRow title="Market/Service area">
            <ListCardTags values={marketServiceArea} />
          </DetailsCardRow>

          <DetailsCardRow title="LinkedIn profile URL">
            {linkedInProfileHref && (
              <DetailsCardRowLink href={linkedInProfileHref} />
            )}
          </DetailsCardRow>
          <DetailsCardRow title="What do you want other Redesigners to know about you?">
            {additionalInfo}
          </DetailsCardRow>
          <DetailsCardRow title="CEO Bio">{biography}</DetailsCardRow>
          {isSameUser && (
            <DetailsCardRow title="CEO Directory opt-in?">
              {isOptIn && (
                <>
                  Yes, I want to <Text as="b">opt-in</Text> to having my profile
                  be visible in the directory.
                </>
              )}
              {!isOptIn && (
                <>
                  No, I do not want to <Text as="b">opt-in</Text> to having my
                  profile be visible in the directory.
                </>
              )}
            </DetailsCardRow>
          )}
        </DetailsCardBody>
      </DetailsCard>
    </Page>
  )
}

export default CeoProfileDetailsPage
