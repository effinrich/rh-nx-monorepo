/**
 * Streaming AI renderer – stateless reparse with the streaming extension.
 *
 * For accumulated AI responses, reparses the complete accumulated string on each
 * update. There is NO incremental parser state carried between renders.
 *
 * The streaming extension suppresses empty trailing headings, blockquotes, and
 * list items while a response is incomplete. Unclosed code fences render all
 * accumulated code after the opening fence.
 *
 * Security posture for AI output (untrusted content):
 * - allowHtml: disabled (raw HTML escaped)
 * - frontmatter: disabled (prevents reinterpretation of response start)
 * - headingIds: disabled (avoids ID churn as streamed headings grow)
 * - Executable URL protocols stripped by default
 */
import { streamingMarkdownExtension } from '@tanstack/markdown/extensions/streaming'
import { Markdown } from '@tanstack/markdown/react'
import type { MarkdownComponents } from '@tanstack/markdown/react'
import type { ReactElement } from 'react'

import type { CodeHighlighter, MarkdownExtension } from '@tanstack/markdown'

// ─── Singleton Extension Instance ────────────────────────────────────────────

/**
 * Module-level singleton – the streaming extension is stateless and reusable.
 * Allocating it once avoids per-render object churn.
 */
const STREAMING_EXTENSIONS: MarkdownExtension[] = [streamingMarkdownExtension()]

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StreamingContentProps {
  /** The accumulated AI response text so far */
  children: string
  /** Component overrides for custom rendering of HTML elements */
  components?: MarkdownComponents
  /** External syntax highlighter – explicit integration, not bundled */
  highlighter?: CodeHighlighter
  /** Show line numbers in code blocks */
  codeLineNumbers?: boolean
  /** Additional extensions beyond the streaming profile */
  extensions?: MarkdownExtension[]
  /** Additional className on the wrapper element */
  className?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

/**
 * Renders accumulated AI response text with the streaming profile.
 *
 * Each render parses the complete accumulated string synchronously – no
 * incremental parser state to coordinate or discard between updates.
 *
 * The streaming extension is always active. Additional extensions can be
 * layered on top for callouts, tabs, etc. if the AI output uses them.
 *
 * @example
 * ```tsx
 * import { StreamingContent } from '@redesignhealth/markdown-renderer'
 *
 * function AIResponse({ text }: { text: string }) {
 *   return <StreamingContent>{text}</StreamingContent>
 * }
 * ```
 */
export function StreamingContent({
  children,
  components,
  highlighter,
  codeLineNumbers = false,
  extensions,
  className,
}: StreamingContentProps): ReactElement {
  // Merge streaming extension with any additional extensions the consumer needs.
  // Streaming extension always comes first so its transformDocument runs last
  // (extensions are applied in order, each sees the previous transform's output).
  const allExtensions = extensions
    ? [...STREAMING_EXTENSIONS, ...extensions]
    : STREAMING_EXTENSIONS

  const content = (
    <Markdown
      extensions={allExtensions}
      frontmatter={false}
      headingIds={false}
      allowHtml={false}
      highlighter={highlighter}
      codeLineNumbers={codeLineNumbers}
      components={components}
    >
      {children}
    </Markdown>
  )

  if (className) {
    return <div className={className}>{content}</div>
  }

  return content
}

// ─── Imperative HTML helper for non-React streaming contexts ─────────────────

import { renderHtml } from '@tanstack/markdown/html'

export interface StreamingHtmlOptions {
  /** External syntax highlighter */
  highlighter?: CodeHighlighter
  /** Show line numbers in code blocks */
  codeLineNumbers?: boolean
  /** Additional extensions beyond the streaming profile */
  extensions?: MarkdownExtension[]
}

/**
 * Render accumulated AI response text to an HTML string using the streaming profile.
 * Useful for non-React contexts (web components, vanilla JS, SSR edge workers).
 *
 * Same stateless reparse semantics – no parser state carried between calls.
 */
export function renderStreamingHtml(
  accumulatedText: string,
  opts: StreamingHtmlOptions = {}
): string {
  const allExtensions = opts.extensions
    ? [...STREAMING_EXTENSIONS, ...opts.extensions]
    : STREAMING_EXTENSIONS

  return renderHtml(accumulatedText, {
    extensions: allExtensions,
    frontmatter: false,
    headingIds: false,
    allowHtml: false,
    highlighter: opts.highlighter,
    codeLineNumbers: opts.codeLineNumbers ?? false,
  })
}
