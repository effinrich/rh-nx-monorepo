import { memo } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { useCurrentUserQuery } from '@redesignhealth/third-party-network/features/authentication'
import {
  AvatarFallback,
  AvatarRoot,
  CardBody,
  CardHeader,
  CardRoot,
  Flex,
  Grid,
  IconButton,
  Link,
  ListRoot,
  MenuContent,
  MenuItem,
  MenuPositioner,
  MenuRoot,
  MenuTrigger,
  TagLabel,
  TagRoot,
  Text,
  useDisclosure
} from '@redesignhealth/ui'

import { IntroductionRequestForm } from '../../introduction-request/introduction-request'

import { AdvisorAttribute } from './advisor-attribute'
import { AdvisorBio } from './advisor-bio'

interface AdvisorCardProps {
  advisorId: string
  name?: string
  advisorRole?: string
  organization?: string
  linkedIn?: string
  opcoEngagementNames?: Array<string>
  categories?: Array<string>
  tags?: Array<string>
  bio?: string
}

export const AdvisorCard = memo(
  ({
    advisorId,
    advisorRole,
    categories,
    linkedIn,
    name,
    opcoEngagementNames,
    organization,
    tags,
    bio
  }: AdvisorCardProps) => {
    const { data: currentUser } = useCurrentUserQuery()
    const { open, onClose, onOpen } = useDisclosure()

    const contractRequestParams = new URLSearchParams({
      email: currentUser?.email ?? '',
      name: `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`,
      id: advisorId,
      advisorName: name ?? ''
    }).toString()

    return (
      <CardRoot variant="outline" boxShadow="md" aria-label="card">
        <CardHeader
          as={Flex}
          justifyContent="space-between"
          alignItems="center"
          py="12px"
          pb="0"
        >
          <Flex align="center" gap="16px">
            <AvatarRoot
              bg="gray.100"
              color="gray.500"
              height="40px"
              width="40px"
            >
              <AvatarFallback name={name} />
            </AvatarRoot>
            <Flex align="center" gap="10px">
              <Text
                as="span"
                fontWeight="medium"
                fontSize="16px"
                letterSpacing="wide"
              >
                {name}
              </Text>
              <AdvisorBio bio={bio} />
            </Flex>
          </Flex>
          <MenuRoot>
            <MenuTrigger asChild>
              <IconButton
                display="flex"
                justifyContent="center"
                alignItems="center"
                variant="ghost"
                aria-label="More options"
              >
                <MdMoreHoriz fontSize="24px" />
              </IconButton>
            </MenuTrigger>
            <MenuPositioner>
              <MenuContent>
                <MenuItem value="see-bio" asChild>
                  <RouterLink to={`/${advisorId}`}>See bio</RouterLink>
                </MenuItem>
                <MenuItem value="request-intro" onClick={onOpen}>
                  Request introduction
                </MenuItem>
                <MenuItem value="request-contract" asChild>
                  <a
                    href={`https://5inxi4pt259.typeform.com/to/dIAXUaDn#${contractRequestParams}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Request contract
                  </a>
                </MenuItem>
              </MenuContent>
            </MenuPositioner>
          </MenuRoot>
        </CardHeader>
        <CardBody py="16px" pl="77px">
          <Grid as={ListRoot} templateColumns="1.5fr 1fr 1fr" gap="32px">
            <AdvisorAttribute attribute="Current Organization & Role">
              {organization}
              {organization && advisorRole && ' - '}
              {advisorRole}
            </AdvisorAttribute>
            <AdvisorAttribute attribute="OpCo Engagements">
              {opcoEngagementNames?.join(', ')}
            </AdvisorAttribute>
            <AdvisorAttribute attribute="LinkedIn">
              <Link
                href={linkedIn}
                target="_blank"
                color={linkedIn ? 'blue.500' : 'gray.500'}
                pointerEvents={linkedIn ? 'auto' : 'none'}
              >
                LinkedIn Profile
              </Link>
            </AdvisorAttribute>
          </Grid>

          <Flex gap="8px" mt="24px">
            {categories?.map(category => (
              <TagRoot aria-label="category" colorPalette="blue" key={category}>
                <TagLabel>{category}</TagLabel>
              </TagRoot>
            ))}
            {tags?.map(tag => (
              <TagRoot aria-label="tag" colorPalette="green" key={tag}>
                <TagLabel>{tag}</TagLabel>
              </TagRoot>
            ))}
          </Flex>
        </CardBody>
        <IntroductionRequestForm
          advisorId={advisorId}
          advisorName={name}
          open={open}
          onClose={onClose}
        />
      </CardRoot>
    )
  }
)

AdvisorCard.displayName = 'AdvisorCard'
