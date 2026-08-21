/**
 * @redesignhealth/markdown-renderer
 *
 * Technical content renderer built on TanStack Markdown.
 *
 * Architecture:
 * - Serializable AST (MarkdownDocument) is the durable document model
 * - Parse once → cache/persist → render from tree with HTML, React, or Octane
 * - Only the syntax extensions the product needs are enabled
 * - Streaming profile for accumulated AI responses (no incremental parser state)
 * - Safe defaults and deterministic output preserved
 * - Syntax highlighting is an explicit external integration
 */

// ─── Core: Parse, Options, Types ─────────────────────────────────────────────
export {
  parseContent,
  createParseOptions,
  createRenderOptions,
  loadExtensions
} from './core'

export type {
  ContentParseOptions,
  ContentRenderOptions,
  ExtensionId
} from './core'

export type {
  MarkdownDocument,
  MarkdownExtension,
  ParseOptions,
  RenderOptions,
  CodeHighlighter,
  BlockNode,
  InlineNode,
  HeadingNode,
  ParagraphNode,
  CodeBlockNode,
  ListNode,
  TableNode
} from './core'

// ─── React Renderer ──────────────────────────────────────────────────────────
export { TechnicalContent, renderContentToReact } from './react-renderer'

export type {
  TechnicalContentProps,
  RenderToReactOptions,
  MarkdownComponents
} from './react-renderer'

// ─── Streaming AI Renderer ───────────────────────────────────────────────────
export { StreamingContent, renderStreamingHtml } from './streaming-renderer'

export type {
  StreamingContentProps,
  StreamingHtmlOptions
} from './streaming-renderer'

// ─── HTML Renderer (Server/Build) ────────────────────────────────────────────
export {
  renderContentToHtml,
  renderDocumentToHtml,
  renderFragmentToHtml
} from './html-renderer'

export type { HtmlRenderOptions } from './html-renderer'
