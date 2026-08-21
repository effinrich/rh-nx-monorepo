import { Box, BoxProps } from '@chakra-ui/react'

const proseClass = 'chakra-prose'

/**
 * Prose component — v3-compatible replacement for @nikolovlazar/chakra-ui-prose.
 *
 * Nested typography lives in a stylesheet (not Chakra `css` selectors) because
 * v3's css() crashes on descendant selector maps (`prop.startsWith is not a function`).
 */
const proseStyles = `
.${proseClass} h1, .${proseClass} h2, .${proseClass} h3, .${proseClass} h4, .${proseClass} h5, .${proseClass} h6 {
  font-weight: 700;
  line-height: 1.3;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}
.${proseClass} h1 { font-size: 1.5rem; }
.${proseClass} h2 { font-size: 1.25rem; }
.${proseClass} h3 { font-size: 1.125rem; }
.${proseClass} p { margin-bottom: 1em; line-height: 1.7; }
.${proseClass} ul, .${proseClass} ol { padding-left: 1.5em; margin-bottom: 1em; }
.${proseClass} li { margin-bottom: 0.25em; }
.${proseClass} a { color: var(--chakra-colors-blue-500, #3182ce); text-decoration: underline; }
.${proseClass} blockquote {
  border-left: 4px solid var(--chakra-colors-gray-300, #cbd5e0);
  padding-left: 1em;
  font-style: italic;
  margin-bottom: 1em;
}
.${proseClass} code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875em;
  background: var(--chakra-colors-gray-100, #edf2f7);
  border-radius: 0.375rem;
  padding: 0.2em 0.4em;
}
.${proseClass} pre {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875em;
  background: var(--chakra-colors-gray-100, #edf2f7);
  border-radius: 0.375rem;
  padding: 1em;
  overflow-x: auto;
  margin-bottom: 1em;
}
.${proseClass} pre code { background: transparent; padding: 0; }
.${proseClass} img { max-width: 100%; height: auto; }
.${proseClass} table { width: 100%; border-collapse: collapse; margin-bottom: 1em; }
.${proseClass} th, .${proseClass} td {
  border: 1px solid var(--chakra-colors-gray-200, #e2e8f0);
  padding: 0.5em;
}
.${proseClass} th { background: var(--chakra-colors-gray-50, #f7fafc); font-weight: 700; }
.${proseClass} hr { border-color: var(--chakra-colors-gray-200, #e2e8f0); margin: 2em 0; }
.${proseClass} .wide-image { width: 100%; }
`

export const Prose = ({ children, className, ...rest }: BoxProps) => (
  <Box className={[proseClass, className].filter(Boolean).join(' ')} {...rest}>
    <style>{proseStyles}</style>
    {children}
  </Box>
)

Prose.displayName = 'Prose'

export default Prose
