import { useState } from 'react'
import { MdLock, MdOpenInNew } from 'react-icons/md'
import { CallNoteCardProps } from '@redesignhealth/portal/data-assets'
import { formatDate } from '@redesignhealth/portal/utils'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Flex,
  Tag,
  Text
} from '@redesignhealth/ui'

import { ListCard } from '../../../list-card/list-card'
import { SearchMatches } from '../../../search-matches/search-matches'
import SelectedExcerptsRow from '../../../selected-excerpts-row/selected-excerpts-row'
import { SupportingFile } from '../research-sprints/supporting-files'

export const isValidUrl = (url: string | undefined) => {
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  )

  return !!urlPattern.test(url || '')
}

export const CallNoteCard = ({
  additionalTags,
  highlightedText,
  intervieweeName,
  intervieweeCompany,
  intervieweeEmail,
  interviewSource,
  linkedInProfileHref,
  noteAuthor,
  created,
  isConflict,
  noteLink,
  type,
  groupName,
  groupStage,
  taxonomies,
  stakeholders,
  attachments
}: CallNoteCardProps) => {
  const [isShowMore, setIsShowMore] = useState(false)

  return (
    <ListCard>
      <ListCard.Header
        title={
          intervieweeCompany
            ? `${intervieweeName} - ${intervieweeCompany}`
            : intervieweeName
        }
        subtitle={`${noteAuthor}, ${formatDate(created)}`}
      >
        {isConflict ? (
          <Flex align="center" gap="8px" color="gray.800" ml="auto">
            <MdLock height="16px" width="16px" color="red" />
            <Text
              fontWeight="600"
              fontSize="16px"
              lineHeight="24px"
              color="red"
            >
              Conflict of interest
            </Text>
          </Flex>
        ) : isValidUrl(noteLink) ? (
          <Button
            as="a"
            target="_blank"
            sx={{ textDecoration: 'none' }}
            href={noteLink}
            rightIcon={<MdOpenInNew />}
            colorScheme="primary"
            variant="solid"
            width={['100%', '100%', 'initial']}
          >
            Read notes
          </Button>
        ) : (
          <Alert
            status="error"
            rounded="md"
            ml="auto"
            pr={1}
            width={['100%', '100%', 'initial']}
            h="40px"
          >
            <AlertIcon />
            <AlertTitle>Invalid URL</AlertTitle>
          </Alert>
        )}
      </ListCard.Header>

      <ListCard.RowsContainer>
        <ListCard.Row title={groupStage}>
          {groupName ? groupName : ''}
        </ListCard.Row>
        <ListCard.Row title="LinkedIn">
          {linkedInProfileHref ? (
            <Button
              as="a"
              target="_blank"
              variant="link"
              href={linkedInProfileHref}
              colorScheme="primary"
              cursor="pointer"
            >
              {linkedInProfileHref ? linkedInProfileHref : ''}
            </Button>
          ) : (
            ''
          )}
        </ListCard.Row>
        <ListCard.Row title="Additional tags">
          <Flex gap="2">
            {additionalTags && additionalTags.length > 0
              ? additionalTags?.map((tag, index) => (
                  <Tag variant="solid" key={index}>
                    {tag}
                  </Tag>
                ))
              : ''}
          </Flex>
        </ListCard.Row>

        <SelectedExcerptsRow
          highlightedText={highlightedText}
          featuredField="intervieweeName"
        />
        {isShowMore && (
          <>
            <ListCard.Row title="Note type">{type}</ListCard.Row>
            <ListCard.Row title="Interview source">
              {interviewSource ? interviewSource : ''}
            </ListCard.Row>
            <ListCard.Row title="Stakeholders">
              <Flex gap="2">
                {stakeholders && stakeholders.length > 0
                  ? stakeholders?.map((tag, index) => (
                      <Tag variant="solid" key={index}>
                        {tag}
                      </Tag>
                    ))
                  : ''}
              </Flex>
            </ListCard.Row>

            <ListCard.Row title="Email">
              {intervieweeEmail ? (
                <Button
                  as="a"
                  target="_blank"
                  variant="link"
                  href={`mailto:${intervieweeEmail}`}
                  colorScheme="primary"
                  cursor="pointer"
                >
                  {intervieweeEmail ? intervieweeEmail : ''}
                </Button>
              ) : (
                ''
              )}
            </ListCard.Row>

            <ListCard.Row title="Taxonomy">
              {taxonomies ? taxonomies?.join(', ') : ''}
            </ListCard.Row>

            <ListCard.Row title="Attachments">
              {attachments &&
                attachments.map((file, index) => (
                  <SupportingFile
                    name={file.name}
                    link={file.href}
                    key={`${file.name}-${index}`}
                  />
                ))}
            </ListCard.Row>
          </>
        )}

        <ListCard.Row>
          <Button
            onClick={() => setIsShowMore(!isShowMore)}
            variant="link"
            colorScheme="primary"
            size="md"
          >
            Show {isShowMore ? 'less' : 'more'}
          </Button>
        </ListCard.Row>
      </ListCard.RowsContainer>
    </ListCard>
  )
}
