/**
 * HTML renderer – for server/build pipeline usage.
 *
 * Renders from a pre-parsed MarkdownDocument AST or raw source string to an
 * HTML string. Ideal for:
 * - Static site generation / build pipelines
 * - Server-side rendering (SSR)
 * - Content indexes and search snippets
 * - High-traffic SSR paths where rendering a cached AST is fastest
 *
 * Preserves the same safe defaults and deterministic output as the React renderer.
 * Syntax highlighting remains an explicit external integration.
 */
import { renderHtml } from '@tanstack/markdown/html'
import type {
  CodeHighlighter,
  MarkdownDocument,
  MarkdownExtension
} from '@tanstack/markdown'

import { createRenderOptions } from './core'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface HtmlRenderOptions {
  /** External syntax highlighter callback */
  highlighter?: CodeHighlighter
  /** Syntax extensions to enable */
  extensions?: MarkdownExtension[]
  /** Show line numbers in code blocks (default: false) */
  codeLineNumbers?: boolean
  /** Render anchor links in headings (default: false) */
  headingAnchors?: boolean
  /** Parse frontmatter (default: true) */
  frontmatter?: boolean
  /** Generate heading IDs (default: true) */
  headingIds?: boolean
  /** Allow raw HTML passthrough (default: false – safe) */
  allowHtml?: boolean
}

// ─── Render API ──────────────────────────────────────────────────────────────

/**
 * Render a MarkdownDocument AST or markdown source string to an HTML string.
 *
 * When given a pre-parsed AST, no parsing occurs – this is the fastest path.
 * The AST can be loaded from cache, a database, or a CDN edge store.
 *
 * @example Build pipeline – parse once, render many times
 * ```ts
 * import { parseContent, renderContentToHtml } from '@redesignhealth/markdown-renderer'
 *
 * const ast = parseContent(source, { extensions: myExtensions })
 * await cache.set(key, JSON.stringify(ast))
 *
 * // Later, on each request:
 * const html = renderContentToHtml(ast, { highlighter: myHighlighter })
 * ```
 *
 * @example Simple one-shot render
 * ```ts
 * const html = renderContentToHtml('# Hello **world**')
 * ```
 */
export function renderContentToHtml(
  input: string | MarkdownDocument,
  opts: HtmlRenderOptions = {}
): string {
  const renderOptions = createRenderOptions({
    extensions: opts.extensions,
    highlighter: opts.highlighter,
    codeLineNumbers: opts.codeLineNumbers ?? false,
    headingAnchors: opts.headingAnchors ?? false,
    frontmatter: opts.frontmatter ?? true,
    headingIds: opts.headingIds ?? true,
    allowHtml: opts.allowHtml ?? false
  })

  return renderHtml(input, renderOptions)
}

// ─── Convenience: render a single block for partial content updates ──────────

/**
 * Parse and render a single markdown fragment to HTML.
 * Useful for rendering inline content like a single paragraph or heading
 * without the overhead of a full document render.
 */
export function renderFragmentToHtml(
  fragment: string,
  opts: HtmlRenderOptions = {}
): string {
  return renderContentToHtml(fragment, opts)
}

/**
 * Render a pre-parsed AST to HTML, asserting the input is already a document.
 * Skips the type check branch – use when you know the input is an AST.
 */
export function renderDocumentToHtml(
  document: MarkdownDocument,
  opts: HtmlRenderOptions = {}
): string {
  return renderContentToHtml(document, opts)
}
