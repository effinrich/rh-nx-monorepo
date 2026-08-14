/**
 * React renderer – renders from a pre-parsed MarkdownDocument AST or raw source.
 *
 * Wraps @tanstack/markdown/react with opinionated defaults:
 * - Component overrides for custom element rendering
 * - Explicit external syntax highlighting integration
 * - Safe defaults preserved (no raw HTML, deterministic output)
 */
import { Markdown, renderMarkdownReact } from '@tanstack/markdown/react'
import type { MarkdownComponents, MarkdownProps } from '@tanstack/markdown/react'
import type { ReactElement, ReactNode } from 'react'

import type { CodeHighlighter, MarkdownDocument, MarkdownExtension } from '@tanstack/markdown'
import { createRenderOptions } from './core'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TechnicalContentProps {
  /** Markdown source string or pre-parsed MarkdownDocument AST */
  children: string | MarkdownDocument
  /** Component overrides – map HTML tag names or custom component names to React components */
  components?: MarkdownComponents
  /** External syntax highlighter – explicitly provided, never bundled */
  highlighter?: CodeHighlighter
  /** Syntax extensions enabled for this render */
  extensions?: MarkdownExtension[]
  /** Show line numbers in fenced code blocks */
  codeLineNumbers?: boolean
  /** Render anchor links in headings */
  headingAnchors?: boolean
  /** Parse frontmatter (default: true for docs, disable for AI responses) */
  frontmatter?: boolean
  /** Generate heading IDs (default: true) */
  headingIds?: boolean
  /** Allow raw HTML passthrough – leave disabled for untrusted content */
  allowHtml?: boolean
  /** Additional className on the wrapper element */
  className?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Renders technical content from a serializable AST or raw markdown source.
 *
 * Accepts a pre-parsed MarkdownDocument (the durable document model) or a raw
 * string. When given an AST, no parsing occurs – rendering is the fastest path.
 *
 * Syntax highlighting is an explicit external integration: pass a `highlighter`
 * callback built from @tanstack/highlight or any other synchronous tokenizer.
 *
 * @example
 * ```tsx
 * import { TechnicalContent } from '@redesignhealth/markdown-renderer'
 * import { highlightCode } from './my-highlighter'
 *
 * <TechnicalContent highlighter={highlightCode} codeLineNumbers>
 *   {document}
 * </TechnicalContent>
 * ```
 */
export function TechnicalContent({
  children,
  components,
  highlighter,
  extensions,
  codeLineNumbers = false,
  headingAnchors = false,
  frontmatter = true,
  headingIds = true,
  allowHtml = false,
  className,
}: TechnicalContentProps): ReactElement {
  const renderOptions = createRenderOptions({
    extensions,
    highlighter,
    codeLineNumbers,
    headingAnchors,
    frontmatter,
    headingIds,
    allowHtml,
  })

  // Build the props for the underlying Markdown component
  const markdownProps: MarkdownProps = {
    children,
    ...renderOptions,
    components,
  }

  if (className) {
    return (
      <div className={className}>
        <Markdown {...markdownProps} />
      </div>
    )
  }

  return <Markdown {...markdownProps} />
}

// ─── Imperative API ──────────────────────────────────────────────────────────

export interface RenderToReactOptions {
  components?: MarkdownComponents
  highlighter?: CodeHighlighter
  extensions?: MarkdownExtension[]
  codeLineNumbers?: boolean
  headingAnchors?: boolean
  frontmatter?: boolean
  headingIds?: boolean
  allowHtml?: boolean
}

/**
 * Render a MarkdownDocument AST or source string to a ReactNode tree imperatively.
 * Useful for contexts where a component isn't convenient (e.g. render props, tests).
 */
export function renderContentToReact(
  input: string | MarkdownDocument,
  opts: RenderToReactOptions = {}
): ReactNode {
  const renderOptions = createRenderOptions({
    extensions: opts.extensions,
    highlighter: opts.highlighter,
    codeLineNumbers: opts.codeLineNumbers ?? false,
    headingAnchors: opts.headingAnchors ?? false,
    frontmatter: opts.frontmatter ?? true,
    headingIds: opts.headingIds ?? true,
    allowHtml: opts.allowHtml ?? false,
  })

  return renderMarkdownReact(input, {
    ...renderOptions,
    components: opts.components,
  })
}

// ─── Re-exports ──────────────────────────────────────────────────────────────

export type { MarkdownComponents, MarkdownProps }
