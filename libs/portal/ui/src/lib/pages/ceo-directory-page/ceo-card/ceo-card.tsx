import {
  MdInfoOutline,
  MdLocationPin,
  MdLock,
  MdMail,
  MdVisibilityOff
} from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import {
  CompanyApiEnum,
  HighlightedText,
  RoleAuthorityEnum
} from '@redesignhealth/portal/data-assets'
import { HasRole } from '@redesignhealth/portal/utils'
import {
  Avatar,
  Button,
  Flex,
  HStack,
  Icon,
  Link,
  Text,
  Tooltip
} from '@redesignhealth/ui'

import { ListCard } from '../../../list-card/list-card'
import { ListCardHeader } from '../../../list-card/list-card-header'
import { ListCardRow } from '../../../list-card/list-card-row'
import { ListCardRowsContainer } from '../../../list-card/list-card-rows-container'
import { ListCardTags } from '../../../list-card/list-card-tags'
import SelectedExcerptsRow from '../../../selected-excerpts-row/selected-excerpts-row'

export interface CeoCardProps {
  ceoGivenName: string
  ceoFamilyName: string
  ceoEmail: string
  ceoPictureHref?: string
  location?: string | null
  company?: {
    href?: string
    name?: string
    description?: string
    fundraiseStatus?: CompanyApiEnum
  }
  businessType?: CompanyApiEnum
  customerSegments?: CompanyApiEnum[]
  healthcareSector?: CompanyApiEnum
  businessFocusArea?: CompanyApiEnum[]
  id: string
  currentRole?: RoleAuthorityEnum
  visible?: string
  isCeoOptOut?: boolean
  highlightedText?: HighlightedText
}
export const CeoCard = ({
  ceoGivenName,
  ceoFamilyName,
  ceoEmail,
  ceoPictureHref,
  location,
  company,
  customerSegments,
  healthcareSector,
  businessFocusArea,
  id,
  visible,
  currentRole,
  isCeoOptOut,
  highlightedText
}: CeoCardProps) => {
  const ceoName = `${ceoGivenName} ${ceoFamilyName}`
  const blurProps = {
    color: 'transparent',
    textShadow: '0 0 10px #000'
  }

  return (
    <ListCard>
      <ListCardHeader
        leftAddon={<Avatar name={ceoName} src={ceoPictureHref} />}
        title={
          isCeoOptOut ? (
            <Text>
              {ceoGivenName}{' '}
              <Text as="span" {...blurProps}>
                {ceoFamilyName}
              </Text>
            </Text>
          ) : (
            <HStack gap={2}>
              <Text>{ceoName}</Text>
              {(!visible || visible === 'OPT_OUT') && (
                <HasRole
                  allowed={[
                    'ROLE_RH_ADMIN',
                    'ROLE_SUPER_ADMIN',
                    'ROLE_RH_USER'
                  ]}
                  currentRole={currentRole}
                >
                  <Tooltip
                    hasArrow
                    label="CEO opt-out, profile not externally visible"
                    placement="right"
                    aria-label="CEO has opted out of CEO Directory"
                  >
                    <Flex align="center">
                      <Icon
                        as={MdVisibilityOff}
                        color="red.500"
                        aria-label="CEO opt-out icon"
                        boxSize={6}
                      />
                    </Flex>
                  </Tooltip>
                </HasRole>
              )}
            </HStack>
          )
        }
        subtitle={
          <Flex gap={8} flexWrap="wrap">
            <Flex gap={2}>
              <Icon boxSize={5} as={MdMail} />
              {isCeoOptOut ? (
                <Text {...blurProps}>{ceoEmail}</Text>
              ) : (
                <Link href={`mailto:${ceoEmail}`}>{ceoEmail}</Link>
              )}
            </Flex>
            {location && (
              <Flex gap={2}>
                <Icon boxSize={5} as={MdLocationPin} />
                {isCeoOptOut ? (
                  <Text {...blurProps}>{location}</Text>
                ) : (
                  <Text>{location}</Text>
                )}
              </Flex>
            )}
          </Flex>
        }
      >
        {!isCeoOptOut && (
          <Button
            as={RouterLink}
            to={`${id}`}
            colorScheme="primary"
            variant="solid"
            width={['100%', '100%', 'initial']}
          >
            View profile
          </Button>
        )}
        {isCeoOptOut && (
          <HStack color="red">
            <Icon as={MdLock} />
            <Text>Profile restricted</Text>
          </HStack>
        )}
      </ListCardHeader>

      <ListCardRowsContainer>
        <ListCardRow title="Company name">
          <Flex gap={2}>
            {isCeoOptOut && <Text {...blurProps}>{company?.name}</Text>}
            {!isCeoOptOut &&
              (company?.href ? (
                <Link target="_blank" href={company?.href}>
                  {company?.name}
                </Link>
              ) : (
                <Text>{company?.name}</Text>
              ))}{' '}
            {company?.description && (
              <Tooltip hasArrow label={company?.description} placement="right">
                <Flex align="center">
                  <Icon as={MdInfoOutline} boxSize={6} color="gray.500" />
                </Flex>
              </Tooltip>
            )}
          </Flex>
        </ListCardRow>

        <ListCardRow title="Fundraising stage">
          {company?.fundraiseStatus?.displayName}
        </ListCardRow>
        <ListCardRow title="Customer segment">
          <ListCardTags values={customerSegments?.map(e => e.displayName)} />
        </ListCardRow>
        <ListCardRow title="Healthcare sector">
          {healthcareSector?.displayName}
        </ListCardRow>
        <ListCardRow title="Business focus area">
          <ListCardTags values={businessFocusArea?.map(e => e.displayName)} />
        </ListCardRow>
        <SelectedExcerptsRow
          highlightedText={highlightedText}
          featuredField="member.givenName"
        />
      </ListCardRowsContainer>
    </ListCard>
  )
}
