import { Tree, addProjectConfiguration } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import storiesGenerator from './generator';

// Mock ui
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

describe('storiesGenerator (bulk)', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();

    // Register a test project
    addProjectConfiguration(tree, 'shared-ui', {
      root: 'libs/shared/ui',
      sourceRoot: 'libs/shared/ui/src',
      projectType: 'library',
    });
  });

  it('should generate stories for components missing them', async () => {
    tree.write(
      'libs/shared/ui/src/lib/button/button.tsx',
      `
interface ButtonProps { label: string; onClick?: () => void; }
export const Button = ({ label, onClick }: ButtonProps) => <button onClick={onClick}>{label}</button>;
`
    );
    tree.write(
      'libs/shared/ui/src/lib/chip/chip.tsx',
      `export const Chip = ({ text }: { text: string }) => <span>{text}</span>;`
    );

    await storiesGenerator(tree, { project: 'shared-ui' });

    expect(
      tree.exists('libs/shared/ui/src/lib/button/button.stories.tsx')
    ).toBe(true);
    expect(
      tree.exists('libs/shared/ui/src/lib/chip/chip.stories.tsx')
    ).toBe(true);
  });

  it('should skip components that already have stories', async () => {
    tree.write(
      'libs/shared/ui/src/lib/button/button.tsx',
      `export const Button = () => <button>Click</button>;`
    );
    tree.write(
      'libs/shared/ui/src/lib/button/button.stories.tsx',
      '// existing story'
    );

    await storiesGenerator(tree, { project: 'shared-ui' });

    // Should not overwrite existing stories
    expect(
      tree.read('libs/shared/ui/src/lib/button/button.stories.tsx')!.toString()
    ).toBe('// existing story');
  });

  it('should skip non-component files (index, spec, styles)', async () => {
    tree.write(
      'libs/shared/ui/src/lib/button/index.ts',
      `export * from './button';`
    );
    tree.write(
      'libs/shared/ui/src/lib/button/button.spec.tsx',
      `test('works', () => {});`
    );
    tree.write(
      'libs/shared/ui/src/lib/button/button.styles.ts',
      `export const styles = {};`
    );
    tree.write(
      'libs/shared/ui/src/lib/button/button.tsx',
      `export const Button = () => <button>Click</button>;`
    );

    await storiesGenerator(tree, { project: 'shared-ui' });

    // Only the real component should get a story
    expect(
      tree.exists('libs/shared/ui/src/lib/button/button.stories.tsx')
    ).toBe(true);
    expect(
      tree.exists('libs/shared/ui/src/lib/button/index.stories.tsx')
    ).toBe(false);
  });

  it('should report coverage', async () => {
    const { ui } = require('../../utils/ui');

    tree.write(
      'libs/shared/ui/src/lib/a/a.tsx',
      `export const A = () => <div>A</div>;`
    );
    tree.write(
      'libs/shared/ui/src/lib/b/b.tsx',
      `export const B = () => <div>B</div>;`
    );
    tree.write(
      'libs/shared/ui/src/lib/b/b.stories.tsx',
      '// existing'
    );

    await storiesGenerator(tree, { project: 'shared-ui' });

    // Should show coverage info
    expect(ui.success).toHaveBeenCalledWith(
      expect.stringContaining('Coverage')
    );
  });

  it('should throw for non-existent project', async () => {
    await expect(
      storiesGenerator(tree, { project: 'nonexistent' })
    ).rejects.toThrow('not found');
  });

  it('should respect overwrite option', async () => {
    tree.write(
      'libs/shared/ui/src/lib/button/button.tsx',
      `export const Button = () => <button>Click</button>;`
    );
    tree.write(
      'libs/shared/ui/src/lib/button/button.stories.tsx',
      '// old story'
    );

    await storiesGenerator(tree, {
      project: 'shared-ui',
      overwrite: true,
    });

    expect(
      tree.read('libs/shared/ui/src/lib/button/button.stories.tsx')!.toString()
    ).not.toBe('// old story');
  });
});
