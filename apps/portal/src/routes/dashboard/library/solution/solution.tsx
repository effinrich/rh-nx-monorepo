import { useEffect, useState } from 'react'
import { MdChevronLeft } from 'react-icons/md'
import { Link, Outlet, useParams } from 'react-router-dom'
import { LibraryModulePage, Page } from '@redesignhealth/portal/ui'
import { Box, Button, Loader } from '@redesignhealth/ui'

import { FeedbackFooter } from './feedback/feedback-footer'
import { useGetSolutionByIdQuery } from './hooks'

interface SolutionProps {
  libraryRoute: string
}

export const Solution = ({ libraryRoute }: SolutionProps) => {
  const { solutionId, moduleId } = useParams()
  const [moduleTitle, setModuleTitle] = useState<string | undefined>()

  const { data } = useGetSolutionByIdQuery(solutionId)

  // Set a default for `moduleTitle` once data is set so `FeedbackFooter` renders
  useEffect(() => {
    if (moduleTitle === undefined && data !== undefined)
      setModuleTitle(data.children?.[0].title)
  }, [data, moduleTitle])

  return (
    <Page>
      <Button
        as={Link}
        variant="link"
        leftIcon={<MdChevronLeft size="20" />}
        colorScheme="primary"
        to={`/${libraryRoute}`}
        pb={4}
      >
        Back
      </Button>

      {!data ? (
        <Loader w="full" />
      ) : (
        <LibraryModulePage
          currentModuleId={moduleId}
          modules={data.children || []}
          title={data.title}
          helpText={data.description}
        >
          <Outlet />
          {moduleTitle && (
            <Box mt={10}>
              <FeedbackFooter moduleTitle={moduleTitle} id={solutionId} />
            </Box>
          )}
        </LibraryModulePage>
      )}
    </Page>
  )
}
