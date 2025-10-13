import { useEffect, useState } from 'react'
import { MdLaunch } from 'react-icons/md'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { Prose } from '@nikolovlazar/chakra-ui-prose'
import { axiosApi, LibraryDoc } from '@redesignhealth/portal/data-assets'
import {
  Box,
  Button,
  Link as ChakraLink,
  SectionHeader
} from '@redesignhealth/ui'
import parse, {
  attributesToProps,
  domToReact,
  Element,
  HTMLReactParserOptions
} from 'html-react-parser'

import { TemplateButton } from '../template-button'

interface ParseProps {
  data: {
    remoteContentId: string
    content: string
    type: { value: string }
  }
  linkMap: Record<string, string>
  libraryId: string
  libraryRoute: string
}

export const Parser = ({
  data: htmlData,
  linkMap,
  libraryId,
  libraryRoute
}: ParseProps) => {
  const [html, setHtml] = useState<string>('')
  const location = useLocation()
  const navigate = useNavigate()
  const { moduleId } = useParams()
  const parseGoogleHref = (href?: string) => {
    if (!href) {
      return href
    }
    if (href.startsWith('#')) {
      return href
    }
    let parsed: URL | undefined = undefined
    try {
      parsed = new URL(href)
    } catch (e) {
      return href
    }
    const isGoogleDomain = parsed.hostname.endsWith('google.com')
    const isGoogleUrlRedirector = parsed.pathname === '/url'
    const hasQ = parsed.searchParams.has('q')

    const parseGoogleRedirect = isGoogleDomain && isGoogleUrlRedirector && hasQ
    if (parseGoogleRedirect) {
      const redirect = parsed.searchParams.get('q')
      if (!redirect) {
        return href
      }
      const parsedRedirect = new URL(redirect)
      const pathSegments = parsedRedirect.pathname.split('/')
      for (const segment of pathSegments) {
        if (Object.hasOwn(linkMap, segment)) {
          return segment
        }
      }
      return redirect
    }
    return href
  }
  const parserOptions: HTMLReactParserOptions = {
    replace: domNode => {
      if (domNode instanceof Element) {
        const { name, attribs, children } = domNode
        const href = parseGoogleHref(attribs?.href)
        const hasHrefInLinkMap = href ? href in linkMap : false
        const controls = attribs?.controls
        const title = attribs?.title
        const cssClass = attribs?.class
        if (href && hasHrefInLinkMap) {
          const props = attributesToProps(attribs)
          delete props.target
          delete props.href
          return (
            <Link {...props} to={linkMap[href]}>
              {domToReact(children, parserOptions)}
            </Link>
          )
        }
        if (href && href.startsWith('#')) {
          const props = attributesToProps(attribs)
          props.href = location.pathname + href
          return <a {...props}>{domToReact(children, parserOptions)}</a>
        }
        if (href && href.indexOf('redesignhealth.helpjuice.com') !== -1) {
          const props = attributesToProps(attribs)
          props.href = `${location.pathname}#`
          props.target = '_self'
          return (
            <ChakraLink
              {...props}
              onClick={async () => {
                const child = children[0]
                if (child instanceof Text) {
                  const { type, data: linkText } = child
                  if (type !== 'text') {
                    return
                  }
                  const query = (linkText as string)
                    .trim()
                    .replace(/\W/g, '%20')
                  const { data: searchData } = await axiosApi.get<{
                    content: LibraryDoc[]
                  }>(
                    `/library/${libraryId}/content?q=${query}&filter=type%2CTEMPLATE%7C%7CARTICLE%7C%7CVIDEO%7C%7CTOOL`
                  )
                  const { id, parentId } = searchData.content.filter(
                    doc => doc.id !== moduleId
                  )[0]
                  const libraryHref = `/${libraryRoute}/${parentId}/module/${id}`
                  navigate(libraryHref)
                }
              }}
            >
              {domToReact(children, parserOptions)}
            </ChakraLink>
          )
        }
        if (href && !href.startsWith('http') && !href.startsWith('/')) {
          const lastSlash = htmlData?.remoteContentId?.lastIndexOf('/')
          const newBaseAndSlug = htmlData?.remoteContentId?.substring(
            0,
            lastSlash
          )
          const newHref = `${newBaseAndSlug}/${href}`
          if (linkMap[newHref]) {
            const props = attributesToProps(attribs)
            return (
              <Link {...props} to={linkMap[newHref]}>
                {domToReact(children, parserOptions)}
              </Link>
            )
          }
        } else if (href && cssClass && cssClass === 'third-party-button') {
          const props = attributesToProps(attribs)
          props.target = '_blank'
          const thirdPartyButton = (
            <Link {...props} to={href}>
              <Button
                variant="solid"
                colorScheme="primary"
                rightIcon={<MdLaunch />}
                justifyContent="flex-start"
              >
                {domToReact(children, parserOptions)}
              </Button>
            </Link>
          )

          return thirdPartyButton
        } else if (href && !hasHrefInLinkMap) {
          const props = attributesToProps(attribs)
          props.target = '_blank'
          props.href = href
          return <a {...props}>{domToReact(children, parserOptions)}</a>
        }

        if (controls !== undefined) {
          const props = attributesToProps(attribs)
          props.controlsList = 'nodownload'
          // eslint-disable-next-line jsx-a11y/media-has-caption
          return <video {...props}>{domToReact(children, parserOptions)}</video>
        }
        if (
          name === 'img' &&
          title !== undefined &&
          title.startsWith('Wide-Image:')
        ) {
          const props = attributesToProps(attribs)
          props.className = 'wide-image'
          // eslint-disable-next-line jsx-a11y/alt-text
          return <img {...props} />
        }
      }
    }
  }

  const isTemplate = htmlData?.type?.value === 'TEMPLATE'

  useEffect(() => {
    if (htmlData) {
      setHtml(htmlData.content)
    }
  }, [htmlData])

  if (!htmlData.content) return null
  return (
    <Box>
      <SectionHeader
        title=""
        isDivider={false}
        rightElement={
          isTemplate && (
            <TemplateButton remoteContentId={htmlData?.remoteContentId} />
          )
        }
      />
      <Prose>{parse(html as string, parserOptions)}</Prose>
    </Box>
  )
}
