import { Tree } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import storyGenerator from './generator';

// Mock ui to suppress console output in tests
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

describe('storyGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should generate a story file for a named export component', async () => {
    tree.write(
      'libs/shared/ui/src/lib/button/button.tsx',
      `
import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  children?: React.ReactNode;
}

export const Button = ({ label, onClick, variant = 'solid', size = 'md', disabled, children }: ButtonProps) => {
  return <button onClick={onClick} disabled={disabled}>{children ?? label}</button>;
};
`
    );

    await storyGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/button/button.tsx',
    });

    const storyPath = 'libs/shared/ui/src/lib/button/button.stories.tsx';
    expect(tree.exists(storyPath)).toBe(true);

    const content = tree.read(storyPath)!.toString();

    // Check imports
    expect(content).toContain("from '@storybook/react-vite'");
    expect(content).toContain("import { Button } from './button'");

    // Check meta
    expect(content).toContain('component: Button');
    expect(content).toContain("tags: ['autodocs']");

    // Check argTypes
    expect(content).toContain("variant:");
    expect(content).toContain("options: ['solid', 'outline', 'ghost']");
    expect(content).toContain("control: { type: 'select' }");

    // Check default story
    expect(content).toContain('export const Default: Story');

    // Check variant stories
    expect(content).toContain('export const Sizes: Story');
    expect(content).toContain('export const Variants: Story');
    expect(content).toContain('export const Disabled: Story');
  });

  it('should generate interaction tests when not skipped', async () => {
    tree.write(
      'libs/shared/ui/src/lib/toggle/toggle.tsx',
      `
import React from 'react';

interface ToggleProps {
  onClick: () => void;
  label: string;
}

export const Toggle = ({ onClick, label }: ToggleProps) => {
  return <button onClick={onClick}>{label}</button>;
};
`
    );

    await storyGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/toggle/toggle.tsx',
    });

    const content = tree
      .read('libs/shared/ui/src/lib/toggle/toggle.stories.tsx')!
      .toString();

    expect(content).toContain("from '@storybook/test'");
    expect(content).toContain('export const ClickInteraction: Story');
    expect(content).toContain('play: async');
    expect(content).toContain('userEvent.click');
    expect(content).toContain('toHaveBeenCalledTimes(1)');
  });

  it('should skip interaction tests when skipInteractionTests is true', async () => {
    tree.write(
      'libs/shared/ui/src/lib/label/label.tsx',
      `
interface LabelProps {
  text: string;
  onClick: () => void;
}

export const Label = ({ text, onClick }: LabelProps) => <span onClick={onClick}>{text}</span>;
`
    );

    await storyGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/label/label.tsx',
      skipInteractionTests: true,
    });

    const content = tree
      .read('libs/shared/ui/src/lib/label/label.stories.tsx')!
      .toString();

    expect(content).not.toContain("from '@storybook/test'");
    expect(content).not.toContain('ClickInteraction');
  });

  it('should not overwrite an existing story by default', async () => {
    const storyPath = 'libs/shared/ui/src/lib/chip/chip.stories.tsx';

    tree.write(
      'libs/shared/ui/src/lib/chip/chip.tsx',
      `export const Chip = () => <span>Chip</span>;`
    );
    tree.write(storyPath, '// existing story');

    await storyGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/chip/chip.tsx',
    });

    // Should not overwrite
    expect(tree.read(storyPath)!.toString()).toBe('// existing story');
  });

  it('should overwrite when overwrite option is true', async () => {
    const storyPath = 'libs/shared/ui/src/lib/chip/chip.stories.tsx';

    tree.write(
      'libs/shared/ui/src/lib/chip/chip.tsx',
      `export const Chip = () => <span>Chip</span>;`
    );
    tree.write(storyPath, '// existing story');

    await storyGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/chip/chip.tsx',
      overwrite: true,
    });

    expect(tree.read(storyPath)!.toString()).not.toBe('// existing story');
  });

  it('should use custom storyTitle when provided', async () => {
    tree.write(
      'libs/shared/ui/src/lib/icon/icon.tsx',
      `export const Icon = () => <svg />;`
    );

    await storyGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/icon/icon.tsx',
      storyTitle: 'Design System / Iconography / Icon',
    });

    const content = tree
      .read('libs/shared/ui/src/lib/icon/icon.stories.tsx')!
      .toString();

    expect(content).toContain("title: 'Design System / Iconography / Icon'");
  });

  it('should add router decorator when component uses react-router', async () => {
    tree.write(
      'libs/portal/ui/src/lib/nav/nav.tsx',
      `
import { Link } from 'react-router-dom';

interface NavProps {
  items: string[];
}

export const Nav = ({ items }: NavProps) => (
  <nav>{items.map(i => <Link key={i} to={i}>{i}</Link>)}</nav>
);
`
    );

    await storyGenerator(tree, {
      componentPath: 'libs/portal/ui/src/lib/nav/nav.tsx',
    });

    const content = tree
      .read('libs/portal/ui/src/lib/nav/nav.stories.tsx')!
      .toString();

    expect(content).toContain("import { withRouter }");
    expect(content).toContain('decorators: [withRouter]');
  });

  it('should handle default export components', async () => {
    tree.write(
      'libs/shared/ui/src/lib/avatar/avatar.tsx',
      `
interface AvatarProps {
  src: string;
  alt: string;
}

export default function Avatar({ src, alt }: AvatarProps) {
  return <img src={src} alt={alt} />;
}
`
    );

    await storyGenerator(tree, {
      componentPath: 'libs/shared/ui/src/lib/avatar/avatar.tsx',
    });

    const content = tree
      .read('libs/shared/ui/src/lib/avatar/avatar.stories.tsx')!
      .toString();

    expect(content).toContain("import Avatar from './avatar'");
  });

  it('should throw for non-existent component file', async () => {
    await expect(
      storyGenerator(tree, {
        componentPath: 'libs/shared/ui/src/lib/nope/nope.tsx',
      })
    ).rejects.toThrow('Component file not found');
  });
});
