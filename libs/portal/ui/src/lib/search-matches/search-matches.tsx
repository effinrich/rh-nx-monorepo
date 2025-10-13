import { css } from '@emotion/react'
import { HighlightedText } from '@redesignhealth/portal/data-assets'
import { Text } from '@redesignhealth/ui'
import parse from 'html-react-parser'

/**
 * Highlighted search results are not HMTL escaped. Some of our
 * research reports contain invalid HTML and this needs to be escaped.
 * However, we don't want to escape our <em> tags used to highlight specific text.
 *
 * We should look into escaping this on the search server at some point.
 */
const escapeHtmlExceptHighlighting = (unsafe: string) => {
  return (
    unsafe
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      // unescape <em> and </em>
      .replace(/&lt;em&gt;/g, '<em>')
      .replace(/&lt;\/em&gt;/g, '</em>')
  )
}

interface SearchMatchesProps {
  highlightedText?: HighlightedText
  featuredField?: string
}

interface SearchMatchProps {
  text: string
  featured: boolean
}

const highlightCss = css`
  em {
    font-weight: 700;
  }
`

const SearchMatch = ({ text, featured }: SearchMatchProps) => {
  if (featured) {
    return (
      <Text
        fontSize="18px"
        lineHeight="28px"
        color="gray.900"
        css={highlightCss}
      >
        {parse(escapeHtmlExceptHighlighting(text))}
      </Text>
    )
  }

  return (
    <Text fontSize="16px" lineHeight="24px" css={highlightCss}>
      "...{parse(escapeHtmlExceptHighlighting(text))}..."
    </Text>
  )
}

export const SearchMatches = ({
  highlightedText,
  featuredField
}: SearchMatchesProps) => {
  return highlightedText && Object.keys(highlightedText).length ? (
    <>
      {Object.keys(highlightedText).reduce<React.ReactNode[]>(
        (excerpts, field) => {
          const featured = featuredField === field
          const fieldExcerpts = highlightedText[field].map(text => (
            <SearchMatch key={text} text={text} featured={featured} />
          ))
          return [...excerpts, ...fieldExcerpts]
        },
        []
      )}
    </>
  ) : (
    <Text>No search terms entered</Text>
  )
}
