import { useEffect, useState } from 'react'
import { MdLock, MdOpenInNew } from 'react-icons/md'
import { ResearchSprintCardProps } from '@redesignhealth/portal/data-assets'
import { formatDate } from '@redesignhealth/portal/utils'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Badge,
  Box,
  Button,
  Flex,
  Text
} from '@redesignhealth/ui'

import { ListCard } from '../../../list-card/list-card'
import SelectedExcerptsRow from '../../../selected-excerpts-row/selected-excerpts-row'

import { GroupPopover } from './group-popover'
import { SupportingFile } from './supporting-files'

export const ResearchSprintCard = ({
  groupDescription,
  groupName,
  groupStage,
  highlightedText,
  isConflict,
  method,
  objectives,
  reportLink,
  segments,
  services,
  sprintAuthor,
  sprintDate,
  title,
  supportingFiles,
  taxonomy
}: ResearchSprintCardProps) => {
  const [isShowMore, setIsShowMore] = useState(false)
  // TODO: Debug taxonomy conversion in `libs/portal/features/research-hub/src/lib/api.ts`
  // (currently it's returning `undefined` even when there are values present)
  const [validTaxonomyTags, setValidTaxonomyTags] = useState<Array<string>>()

  useEffect(() => {
    const filteredTags = taxonomy?.filter(tag => tag !== undefined)
    setValidTaxonomyTags(filteredTags)
  }, [taxonomy])

  return (
    <ListCard>
      <ListCard.Header
        title={title}
        subtitle={`${sprintAuthor}, ${formatDate(sprintDate)}`}
      >
        {isConflict ? (
          <Flex align="center" gap="8px" color="gray.800" ml="auto">
            <MdLock height="16px" width="16px" color="currentColor" />
            <Text fontWeight="600" fontSize="16px" lineHeight="24px">
              Conflict of interest
            </Text>
          </Flex>
        ) : reportLink ? (
          <Button
            as="a"
            target="_blank"
            sx={{
              textDecoration: 'none'
            }}
            href={reportLink}
            rightIcon={<MdOpenInNew />}
            colorScheme="primary"
            variant="solid"
            width={['100%', '100%', 'inherit']}
          >
            Read report
          </Button>
        ) : (
          <Alert
            status="error"
            rounded="md"
            pr={1}
            maxW="150px"
            h="40px"
            width={['100%', '100%', 'inherit']}
          >
            <AlertIcon />
            <AlertTitle>Invalid URL</AlertTitle>
          </Alert>
        )}
      </ListCard.Header>

      <ListCard.RowsContainer>
        <ListCard.Row title={groupStage}>
          <Flex align="center" gap="16px">
            {groupName ? groupName : ''}
            <GroupPopover description={groupDescription} />
          </Flex>
        </ListCard.Row>

        <ListCard.Row title="Objectives">
          <Box>
            {objectives?.map((objective, index) => (
              <Text key={index} mb={1}>
                {objective}
              </Text>
            ))}
          </Box>
        </ListCard.Row>

        <SelectedExcerptsRow
          highlightedText={highlightedText}
          featuredField="title"
        />

        {isShowMore && (
          <>
            <ListCard.Row title="Services">{services?.join(', ')}</ListCard.Row>
            <ListCard.Row title="Method">{method}</ListCard.Row>
            <ListCard.Row title="Segments">
              <Flex gap="16px">
                {segments?.map((segment, index) => (
                  <Badge key={index} colorScheme="primary" size="sm">
                    {segment}
                  </Badge>
                ))}
              </Flex>
            </ListCard.Row>
            <ListCard.Row title="Taxonomy">
              {validTaxonomyTags ? validTaxonomyTags?.join(', ') : ''}
            </ListCard.Row>
            <ListCard.Row title="Supporting files">
              <Flex flexDir="column" gap="12px">
                {supportingFiles?.map((file, index) => (
                  <SupportingFile
                    key={index}
                    isConflict={isConflict}
                    link={file.href}
                    name={file.name}
                  />
                ))}
              </Flex>
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
