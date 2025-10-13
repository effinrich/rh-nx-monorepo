import { memo } from 'react'
import { MdMoreHoriz } from 'react-icons/md'
import { Link as RouterLink } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { useCurrentUserQuery } from '@redesignhealth/third-party-network/features/authentication'
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Grid,
  IconButton,
  Link,
  List,
  Tag,
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
    const { isOpen, onClose, onOpen } = useDisclosure()

    const contractRequestParams = new URLSearchParams({
      email: currentUser?.email ?? '',
      name: `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`,
      id: advisorId,
      advisorName: name ?? ''
    }).toString()

    return (
      <Card variant="outline" boxShadow="md" aria-label="card">
        <CardHeader
          as={Flex}
          justifyContent="space-between"
          alignItems="center"
          py="12px"
          pb="0"
        >
          <Flex align="center" gap="16px">
            <Avatar
              bg="gray.100"
              color="gray.500"
              name={name}
              height="40px"
              width="40px"
            />
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
          <Menu gutter={4} autoSelect={false}>
            <MenuButton
              as={IconButton}
              display="flex"
              justifyContent="center"
              alignItems="center"
              variant="ghost"
              icon={<MdMoreHoriz fontSize="24px" />}
            />
            <MenuList>
              <MenuItem as={RouterLink} to={`/${advisorId}`}>
                See bio
              </MenuItem>
              <MenuItem onClick={onOpen}>Request introduction</MenuItem>
              <MenuItem
                as="a"
                href={`https://5inxi4pt259.typeform.com/to/dIAXUaDn#${contractRequestParams}`}
                target="_blank"
              >
                Request contract
              </MenuItem>
            </MenuList>
          </Menu>
        </CardHeader>
        <CardBody py="16px" pl="77px">
          <Grid as={List} templateColumns="1.5fr 1fr 1fr" gap="32px">
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
              <Tag aria-label="category" colorScheme="blue" key={category}>
                {category}
              </Tag>
            ))}
            {tags?.map(tag => (
              <Tag aria-label="tag" colorScheme="green" key={tag}>
                {tag}
              </Tag>
            ))}
          </Flex>
        </CardBody>
        <IntroductionRequestForm
          advisorId={advisorId}
          advisorName={name}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Card>
    )
  }
)

AdvisorCard.displayName = 'AdvisorCard'
