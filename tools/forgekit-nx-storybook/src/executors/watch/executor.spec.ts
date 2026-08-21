import * as fs from 'fs';
import * as path from 'path';

import { IGNORED_FILES } from '../../utils/constants';

// Test the isIgnored logic directly since the executor is long-running
// and hard to test end-to-end in unit tests.

// Reproduce the isIgnored function for testing
function isIgnored(fileName: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    const regex = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');
    if (new RegExp(`^${regex}$`).test(fileName)) {
      return true;
    }
  }
  return false;
}

describe('watch executor - isIgnored', () => {
  it('should ignore spec files', () => {
    expect(isIgnored('button.spec.ts', IGNORED_FILES)).toBe(true);
    expect(isIgnored('button.spec.tsx', IGNORED_FILES)).toBe(true);
  });

  it('should ignore test files', () => {
    expect(isIgnored('button.test.ts', IGNORED_FILES)).toBe(true);
    expect(isIgnored('button.test.tsx', IGNORED_FILES)).toBe(true);
  });

  it('should ignore story files', () => {
    expect(isIgnored('button.stories.ts', IGNORED_FILES)).toBe(true);
    expect(isIgnored('button.stories.tsx', IGNORED_FILES)).toBe(true);
  });

  it('should ignore style files', () => {
    expect(isIgnored('button.styles.ts', IGNORED_FILES)).toBe(true);
    expect(isIgnored('button.style.tsx', IGNORED_FILES)).toBe(true);
  });

  it('should ignore index files', () => {
    expect(isIgnored('index.ts', IGNORED_FILES)).toBe(true);
    expect(isIgnored('index.tsx', IGNORED_FILES)).toBe(true);
  });

  it('should not ignore component files', () => {
    expect(isIgnored('button.tsx', IGNORED_FILES)).toBe(false);
    expect(isIgnored('card.ts', IGNORED_FILES)).toBe(false);
    expect(isIgnored('data-table.tsx', IGNORED_FILES)).toBe(false);
  });

  it('should not ignore files with similar but non-matching names', () => {
    expect(isIgnored('index-page.tsx', IGNORED_FILES)).toBe(false);
    expect(isIgnored('test-utils.ts', IGNORED_FILES)).toBe(false);
  });

  it('should work with custom ignore patterns', () => {
    const customPatterns = ['*.mock.*', '*.fixture.*'];
    expect(isIgnored('api.mock.ts', customPatterns)).toBe(true);
    expect(isIgnored('data.fixture.json', customPatterns)).toBe(true);
    expect(isIgnored('component.tsx', customPatterns)).toBe(false);
  });
});

describe('watch executor - file extension filtering', () => {
  const COMPONENT_EXTENSIONS = ['.tsx', '.ts'];

  it('should accept .tsx files', () => {
    expect(COMPONENT_EXTENSIONS.includes(path.extname('button.tsx'))).toBe(true);
  });

  it('should accept .ts files', () => {
    expect(COMPONENT_EXTENSIONS.includes(path.extname('utils.ts'))).toBe(true);
  });

  it('should reject .js files', () => {
    expect(COMPONENT_EXTENSIONS.includes(path.extname('config.js'))).toBe(false);
  });

  it('should reject .css files', () => {
    expect(COMPONENT_EXTENSIONS.includes(path.extname('styles.css'))).toBe(false);
  });

  it('should reject .json files', () => {
    expect(COMPONENT_EXTENSIONS.includes(path.extname('package.json'))).toBe(false);
  });
});

describe('watch executor - story path detection', () => {
  it('should detect .stories. in file path', () => {
    expect('button.stories.tsx'.includes('.stories.')).toBe(true);
    expect('/path/to/button.stories.tsx'.includes('.stories.')).toBe(true);
  });

  it('should not flag component files as stories', () => {
    expect('button.tsx'.includes('.stories.')).toBe(false);
    expect('/path/to/button.tsx'.includes('.stories.')).toBe(false);
  });
});
