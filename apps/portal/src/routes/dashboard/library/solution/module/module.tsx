import { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useLocation, useParams } from 'react-router-dom'
import analytics from '@redesignhealth/analytics'
import { SCROLL_CONTAINER_ID, scrollToTop } from '@redesignhealth/portal/utils'
import { Box, Loader } from '@redesignhealth/ui'

import { Parser } from './partials/parser'
import { useGetArticleLinkMap, useGetModuleByIdQuery } from './hooks'

interface ModuleProps {
  libraryId: string
  libraryRoute: string
}
export const Module = ({ libraryId, libraryRoute }: ModuleProps) => {
  const { moduleId } = useParams()

  const { data, isPending } = useGetModuleByIdQuery(moduleId)
  const { data: linkMap } = useGetArticleLinkMap(libraryId, libraryRoute)

  const { pathname } = useLocation()

  useEffect(() => {
    scrollToTop(SCROLL_CONTAINER_ID)
  }, [pathname])

  useEffect(() => {
    if (data !== undefined) {
      analytics.sendSelectContentEvent({
        content_type: 'Module',
        content_id: data.title
      })
    }
  }, [data])

  return (
    <Box>
      {data && (
        <Helmet>
          <title>{data.title}</title>
        </Helmet>
      )}
      {isPending || !linkMap ? (
        <Loader w="full" />
      ) : (
        <Parser
          data={data}
          libraryId={libraryId}
          libraryRoute={libraryRoute}
          linkMap={linkMap}
        />
      )}
    </Box>
  )
}
