import { useCurrentUserQuery } from '@redesignhealth/third-party-network/features/authentication'
import {
  Box,
  Button,
  Flex,
  Link,
  List,
  ListItem,
  Loader,
  Tag,
  Text,
  useDisclosure
} from '@redesignhealth/ui'

import { IntroductionRequestForm } from '../../introduction-request/introduction-request'
import { useAdvisorQuery } from '../hooks'

import { AdvisorAttribute } from './advisor-attribute'
import { NotFound } from './not-found'
import { OpcoEngagements } from './opco-engagements'

interface AdvisorDetailsProps {
  advisorId: string
}

export const AdvisorDetails = ({ advisorId }: AdvisorDetailsProps) => {
  const { data: currentUser } = useCurrentUserQuery()
  const { data: advisor, isPending } = useAdvisorQuery(advisorId)
  const { isOpen, onClose, onOpen } = useDisclosure()

  if (isPending) return <Loader mt="8px" />
  if (!advisor) return <NotFound />

  const contractRequestParams = new URLSearchParams({
    email: currentUser?.email ?? '',
    name: `${currentUser?.firstName ?? ''} ${currentUser?.lastName ?? ''}`,
    id: advisorId,
    advisorName: advisor.name ?? ''
  }).toString()

  return (
    <Box mt="32px">
      <Flex justify="space-between" align="center">
        <Text fontSize="36px" fontWeight="500">
          {advisor.name}
        </Text>

        <Flex gap="12px">
          <Button
            as="a"
            href={`https://5inxi4pt259.typeform.com/to/dIAXUaDn#${contractRequestParams}`}
            target="_blank"
            colorScheme="purple"
          >
            Request Contract
          </Button>
          <Button colorScheme="blue" onClick={onOpen}>
            Request Introduction
          </Button>
        </Flex>
      </Flex>
      <Flex gap="32px" mt="8px">
        {advisor.linkedIn && (
          <Button
            as="a"
            href={advisor.linkedIn}
            target="blank"
            variant="link"
            colorScheme="blue"
          >
            LinkedIn Profile
          </Button>
        )}
        {advisor.website && (
          <Button
            as="a"
            href={advisor.website}
            target="_blank"
            variant="link"
            colorScheme="blue"
          >
            Website
          </Button>
        )}
      </Flex>

      <Flex gap="8px" mt="16px">
        {advisor.categories?.map(category => (
          <Tag
            key={category}
            aria-label="category"
            colorScheme="blue"
            rounded="2xl"
            size="md"
          >
            {category}
          </Tag>
        ))}
        {advisor.tags?.map(tag => (
          <Tag
            key={tag}
            aria-label="tag"
            colorScheme="green"
            size="md"
            rounded="2xl"
          >
            {tag}
          </Tag>
        ))}
      </Flex>

      <List display="flex" flexDirection="column" gap="56px" mt="64px">
        <ListItem as={AdvisorAttribute} attribute="Bio">
          {advisor.bio ? advisor.bio : 'None'}
        </ListItem>
        <ListItem>
          <List
            display="grid"
            gridTemplateColumns="1fr 1fr"
            rowGap="56px"
            columnGap="78px"
          >
            <ListItem
              as={AdvisorAttribute}
              attribute="Current Organization & Role"
            >
              {advisor.organization && advisor.organization}
              {advisor.organization && advisor.role && ' - '}
              {advisor.role && advisor.role}
            </ListItem>
            <ListItem
              as={AdvisorAttribute}
              attribute="Previous Organization & Role"
            >
              {advisor.previousOrgAndRole}
            </ListItem>
            <ListItem
              as={AdvisorAttribute}
              attribute="# of advising introductions"
            >
              {advisor.numIntroductions ? advisor.numIntroductions : 0}
            </ListItem>
            <ListItem as={AdvisorAttribute} attribute="OpCo Engagements">
              <Flex>
                {!advisor.opcoEngagementNames?.length && 'None'}
                {advisor.opcoEngagementNames?.map((name, i) => {
                  const separator =
                    i < (advisor.opcoEngagementNames?.length ?? 0) - 1 && ','
                  return (
                    <Box key={name} w="fit-content">
                      <OpcoEngagements advisorId={advisor.id} opcoName={name} />
                      {separator}&nbsp;
                    </Box>
                  )
                })}
              </Flex>
            </ListItem>
            <ListItem as={AdvisorAttribute} attribute="Referred by">
              {!advisor.referrerName && 'Unknown'}
              {advisor.referrerName && (
                <>
                  {advisor.referrerName}
                  {advisor.firstEngagementDate &&
                    'with first advisor contract / intro on '}
                  {advisor.firstEngagementDate?.toLocaleDateString('en-us', {
                    dateStyle: 'long'
                  })}
                </>
              )}
            </ListItem>
            <ListItem as={AdvisorAttribute} attribute="OpCo Conflicts">
              {advisor.opcoConflicts ? advisor.opcoConflicts : 'None'}
            </ListItem>
            <ListItem as={AdvisorAttribute} attribute="Taxonomy Tags">
              {advisor.taxonomyTagsText
                ? advisor.taxonomyTagsText?.replace(/;/g, '; ')
                : 'None'}
            </ListItem>
            <ListItem as={AdvisorAttribute} attribute="Tier">
              {advisor.tier ? advisor.tier : 'None'}
            </ListItem>
          </List>
        </ListItem>
      </List>
      <Box as="aside" mt="32">
        <Text as="p" fontSize="sm" fontStyle="italic">
          Please email Rachel Soffer{' '}
          <Link href="mailto:rachel.soffer@redesignhealth.com" color="blue.600">
            (rachel.soffer@redesignhealth.com)
          </Link>{' '}
          to request this advisor's CV
        </Text>
      </Box>
      <IntroductionRequestForm
        advisorId={advisorId}
        isOpen={isOpen}
        onClose={onClose}
        advisorName={advisor.name}
      />
    </Box>
  )
}
