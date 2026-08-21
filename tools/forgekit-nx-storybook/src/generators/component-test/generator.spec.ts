import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import componentTestGenerator from './generator';

// Mock ui to suppress console output
jest.mock('../../utils/ui', () => ({
  ui: {
    banner: jest.fn(),
    success: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    skip: jest.fn(),
    step: jest.fn(),
    hint: jest.fn(),
    done: jest.fn(),
    separator: jest.fn(),
    command: jest.fn((cmd: string) => cmd),
    fileCreated: jest.fn(),
    fileUpdated: jest.fn(),
    fileSkipped: jest.fn(),
    analysisReport: jest.fn(),
  },
}));

describe('componentTestGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should generate a .ct.tsx file for a component', async () => {
    tree.write(
      'libs/shared/ui/src/lib/button/button.tsx',
      `
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button = ({ label, onClick, variant, disabled, children }: ButtonProps) => {
  return <button onClick={onClick} disabled={disabled}>{children ?? label}</button>;
};
`
    );

    await componentTestGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/button/button.tsx',
    });

    const testPath = 'libs/shared/ui/src/lib/button/button.ct.tsx';
    expect(tree.exists(testPath)).toBe(true);

    const content = tree.read(testPath)!.toString();

    // Imports
    expect(content).toContain("from '@playwright/experimental-ct-react'");
    expect(content).toContain("from '@axe-core/playwright'");
    expect(content).toContain("import { Button } from './button'");

    // Test cases
    expect(content).toContain('mounts and renders without crashing');
    expect(content).toContain('matches visual snapshot');
    expect(content).toContain('handles click interaction');
    expect(content).toContain('renders disabled state correctly');
    expect(content).toContain('meets accessibility standards');

    // Variant screenshot tests
    expect(content).toContain('variant="solid"');
    expect(content).toContain('variant="outline"');
    expect(content).toContain('variant="ghost"');
  });

  it('should generate story-driven tests when stories exist', async () => {
    tree.write(
      'libs/shared/ui/src/lib/chip/chip.tsx',
      `export const Chip = ({ label }: { label: string }) => <span>{label}</span>;`
    );
    tree.write(
      'libs/shared/ui/src/lib/chip/chip.stories.tsx',
      `export const Default = {};`
    );

    await componentTestGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/chip/chip.tsx',
    });

    const content = tree
      .read('libs/shared/ui/src/lib/chip/chip.ct.tsx')!
      .toString();

    expect(content).toContain('story-driven tests');
    expect(content).toContain('renders Default story');
    expect(content).toContain("import * as stories from './chip.stories'");
  });

  it('should not overwrite existing test by default', async () => {
    const testPath = 'libs/shared/ui/src/lib/tag/tag.ct.tsx';

    tree.write(
      'libs/shared/ui/src/lib/tag/tag.tsx',
      `export const Tag = () => <span>Tag</span>;`
    );
    tree.write(testPath, '// existing test');

    await componentTestGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/tag/tag.tsx',
    });

    expect(tree.read(testPath)!.toString()).toBe('// existing test');
  });

  it('should overwrite when overwrite option is true', async () => {
    const testPath = 'libs/shared/ui/src/lib/tag/tag.ct.tsx';

    tree.write(
      'libs/shared/ui/src/lib/tag/tag.tsx',
      `export const Tag = () => <span>Tag</span>;`
    );
    tree.write(testPath, '// existing test');

    await componentTestGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/tag/tag.tsx',
      overwrite: true,
    });

    expect(tree.read(testPath)!.toString()).not.toBe('// existing test');
  });

  it('should handle default export components', async () => {
    tree.write(
      'libs/shared/ui/src/lib/badge/badge.tsx',
      `
interface BadgeProps { text: string; }
export default function Badge({ text }: BadgeProps) {
  return <span>{text}</span>;
}
`
    );

    await componentTestGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/badge/badge.tsx',
    });

    const content = tree
      .read('libs/shared/ui/src/lib/badge/badge.ct.tsx')!
      .toString();

    expect(content).toContain("import Badge from './badge'");
  });

  it('should throw for non-existent component', async () => {
    await expect(
      componentTestGenerator(tree, {
        componentPath: 'libs/shared/ui/src/lib/nope/nope.tsx',
      })
    ).rejects.toThrow('Component file not found');
  });
});
