import { useEffect, useState } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { Box, Loader } from '@redesignhealth/ui'
import parse, { HTMLReactParserOptions } from 'html-react-parser'

import { useGetTopicByIdQuery } from './hooks'

export interface DocumentProps {
  id: string | null
  title: string
  description: string
  contentType: 'article' | 'template'
  content: string
}

const options: HTMLReactParserOptions = {}

export const Home = () => {
  const { data, isSuccess, isPending, isError, error } =
    useGetTopicByIdQuery('e0F8zvKM')

  const [html, setHtml] = useState<string>('')
  const { showBoundary } = useErrorBoundary()

  useEffect(() => {
    if (isSuccess) {
      setHtml(data?.content)
    } else if (isError) {
      showBoundary(error)
    }
  }, [data, isSuccess, error, isError, showBoundary])

  return <Box>{isPending ? <Loader /> : parse(html as string, options)}</Box>
}
