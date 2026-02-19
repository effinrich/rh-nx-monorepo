import { Box, BoxProps } from '@chakra-ui/react'

/**
 * Prose component — v3-compatible replacement for @nikolovlazar/chakra-ui-prose.
 *
 * Wraps rich HTML content (from CMS / Google Docs parser) with sensible
 * typographic defaults via a CSS class. Add `prose` styles to your global
 * stylesheet or theme if you need custom typography.
 */
export const Prose = ({ children, ...rest }: BoxProps) => (
  <Box
    className="chakra-prose"
    css={{
      '& h1, & h2, & h3, & h4, & h5, & h6': {
        fontWeight: 'bold',
        lineHeight: '1.3',
        marginTop: '1.5em',
        marginBottom: '0.5em',
      },
      '& h1': { fontSize: '2xl' },
      '& h2': { fontSize: 'xl' },
      '& h3': { fontSize: 'lg' },
      '& p': { marginBottom: '1em', lineHeight: '1.7' },
      '& ul, & ol': { paddingLeft: '1.5em', marginBottom: '1em' },
      '& li': { marginBottom: '0.25em' },
      '& a': { color: 'blue.500', textDecoration: 'underline' },
      '& blockquote': {
        borderLeftWidth: '4px',
        borderLeftColor: 'gray.300',
        paddingLeft: '1em',
        fontStyle: 'italic',
        marginBottom: '1em',
      },
      '& pre, & code': {
        fontFamily: 'mono',
        fontSize: 'sm',
        backgroundColor: 'gray.100',
        borderRadius: 'md',
        padding: '0.2em 0.4em',
      },
      '& pre': {
        padding: '1em',
        overflowX: 'auto',
        marginBottom: '1em',
      },
      '& pre code': { backgroundColor: 'transparent', padding: 0 },
      '& img': { maxWidth: '100%', height: 'auto' },
      '& table': { width: '100%', borderCollapse: 'collapse', marginBottom: '1em' },
      '& th, & td': { border: '1px solid', borderColor: 'gray.200', padding: '0.5em' },
      '& th': { backgroundColor: 'gray.50', fontWeight: 'bold' },
      '& hr': { borderColor: 'gray.200', marginY: '2em' },
      '& .wide-image': { width: '100%' },
    }}
    {...rest}
  >
    {children}
  </Box>
)

Prose.displayName = 'Prose'

export default Prose
