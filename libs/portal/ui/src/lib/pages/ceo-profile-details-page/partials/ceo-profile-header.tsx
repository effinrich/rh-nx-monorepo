import { MdEdit, MdEmail, MdLocationPin, MdVisibilityOff } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { RoleAuthorityEnum } from '@redesignhealth/portal/data-assets'
import { HasRole } from '@redesignhealth/portal/utils'
import { hasRoleMatch } from '@redesignhealth/portal/utils'
import {
  Avatar,
  Flex,
  HStack,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  Tooltip
} from '@redesignhealth/ui'

import DetailsCardHeader from '../../../details-card/details-card-header'

export interface CeoProfileHeaderProps {
  name: string
  isSameUser: boolean
  email?: string
  location?: string
  pictureHref?: string
  isOptIn?: boolean
  currentRole?: RoleAuthorityEnum
}

const CeoProfileHeader = ({
  name,
  email,
  location,
  pictureHref,
  isSameUser,
  isOptIn,
  currentRole
}: CeoProfileHeaderProps) => (
  <DetailsCardHeader
    title={name}
    titleAddon={
      !isOptIn && (
        <HasRole
          allowed={['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_RH_USER']}
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
      )
    }
    leftAddon={<Avatar src={pictureHref} name={name} />}
    // avatarName={name}
    // avatarHref={pictureHref}
    backButtonText="Back to directory"
    subtitle={
      <Stack direction={['column', 'column', 'row']} spacing={[2, 2, 10]}>
        <HStack>
          <Icon as={MdEmail} boxSize={6} color="gray.500" />
          <Link href={`mailto:${email}`} fontWeight="500" data-testid="email">
            {email}
          </Link>
        </HStack>
        {location && (
          <HStack>
            <Icon as={MdLocationPin} boxSize={6} color="gray.500" />
            <Text data-testid="location">{location}</Text>
          </HStack>
        )}
      </Stack>
    }
    rightAddon={
      (isSameUser ||
        hasRoleMatch(['ROLE_RH_ADMIN', 'ROLE_SUPER_ADMIN'], currentRole)) && (
        <IconButton
          as={RouterLink}
          to="edit"
          aria-label="Edit profile"
          icon={<Icon as={MdEdit} />}
          gridArea="right"
          alignSelf="center"
          w={['100%', '100%', 'inherit']}
        />
      )
    }
  />
)

export default CeoProfileHeader
