/**
 * Core module – parse-to-AST, extension registry, and render options factory.
 *
 * The serializable MarkdownDocument AST is the durable document model.
 * Parse once, cache/persist the AST, render from it with any target (HTML, React, Octane).
 */
import { parseMarkdown } from '@tanstack/markdown/parser'
import type {
  CodeHighlighter,
  MarkdownDocument,
  MarkdownExtension,
  ParseOptions,
  RenderOptions
} from '@tanstack/markdown'

// ─── Extension Presets ───────────────────────────────────────────────────────

/**
 * Available syntax extension identifiers.
 * Only enable what the product actually needs – no implicit kitchen-sink.
 */
export type ExtensionId = 'callouts' | 'docs' | 'headings'

/**
 * Lazily load and return only the requested extensions.
 * Each extension is imported from @tanstack/markdown's built-in set.
 */
export async function loadExtensions(
  ids: ExtensionId[]
): Promise<MarkdownExtension[]> {
  const extensions: MarkdownExtension[] = []

  for (const id of ids) {
    switch (id) {
      case 'callouts': {
        const { calloutsExtension } = await import(
          '@tanstack/markdown/extensions/callouts'
        )
        extensions.push(calloutsExtension())
        break
      }
      case 'docs': {
        const { docsMarkdownExtensions } = await import(
          '@tanstack/markdown/extensions/docs'
        )
        extensions.push(...docsMarkdownExtensions())
        break
      }
      case 'headings': {
        const { headingCollectionExtension } = await import(
          '@tanstack/markdown/extensions/headings'
        )
        extensions.push(headingCollectionExtension())
        break
      }
    }
  }

  return extensions
}

// ─── Parse Options Factory ───────────────────────────────────────────────────

export interface ContentParseOptions {
  /** Syntax extensions to enable for this content type */
  extensions?: MarkdownExtension[]
  /** Enable frontmatter extraction (default: true) */
  frontmatter?: boolean
  /** Enable heading ID generation (default: true) */
  headingIds?: boolean
  /** Allow raw HTML passthrough – keep disabled for untrusted content (default: false) */
  allowHtml?: boolean
}

/**
 * Build a ParseOptions object with safe defaults.
 * - frontmatter: true (extract YAML block as raw string)
 * - headingIds: true (generate stable slug IDs)
 * - allowHtml: false (escape raw HTML – safe default)
 */
export function createParseOptions(
  opts: ContentParseOptions = {}
): ParseOptions {
  return {
    extensions: opts.extensions ?? [],
    frontmatter: opts.frontmatter ?? true,
    headingIds: opts.headingIds ?? true,
    allowHtml: opts.allowHtml ?? false
  }
}

// ─── Render Options Factory ──────────────────────────────────────────────────

export interface ContentRenderOptions extends ContentParseOptions {
  /** External syntax highlighter callback – not bundled, explicitly integrated */
  highlighter?: CodeHighlighter
  /** Show line numbers in code blocks (default: false) */
  codeLineNumbers?: boolean
  /** Render anchor links inside headings (default: false) */
  headingAnchors?: boolean
}

/**
 * Build a RenderOptions object that extends parse options with presentation concerns.
 * Syntax highlighting is always an explicit external integration – never bundled.
 */
export function createRenderOptions(
  opts: ContentRenderOptions = {}
): RenderOptions {
  return {
    ...createParseOptions(opts),
    highlighter: opts.highlighter,
    codeLineNumbers: opts.codeLineNumbers ?? false,
    headingAnchors: opts.headingAnchors ?? false
  }
}

// ─── Parse API ───────────────────────────────────────────────────────────────

/**
 * Parse markdown source into a serializable MarkdownDocument AST.
 *
 * The returned object is JSON-safe and can be persisted to a cache, database,
 * or transmitted over the wire. All renderers accept this AST directly.
 */
export function parseContent(
  source: string,
  opts: ContentParseOptions = {}
): MarkdownDocument {
  return parseMarkdown(source, createParseOptions(opts))
}

// ─── Re-exports (types consumers will need) ─────────────────────────────────

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
} from '@tanstack/markdown'
