import { Tree, readJson } from '@nx/devkit';
import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';

import initGenerator from './generator';

// Mock enquirer to avoid interactive prompts in tests
jest.mock('enquirer', () => ({
  prompt: jest.fn().mockResolvedValue({ install: false }),
}));

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

describe('initGenerator', () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.clearAllMocks();
  });

  it('should add Storybook devDependencies when missing', async () => {
    // Pre-add @nx/storybook so it doesn't prompt for install
    tree.write(
      'package.json',
      JSON.stringify({
        name: 'test-workspace',
        devDependencies: {
          '@nx/storybook': '^22.0.0',
        },
      })
    );

    await initGenerator(tree, {});

    const packageJson = readJson(tree, 'package.json');
    const devDeps = packageJson.devDependencies;

    expect(devDeps['@storybook/react-vite']).toBeDefined();
    expect(devDeps['@storybook/test']).toBeDefined();
    expect(devDeps['storybook']).toBeDefined();
  });

  it('should not overwrite existing Storybook dependencies', async () => {
    const existingVersion = '7.6.0';

    tree.write(
      'package.json',
      JSON.stringify({
        name: 'test-workspace',
        devDependencies: {
          '@nx/storybook': '^22.0.0',
          '@storybook/react-vite': existingVersion,
          '@storybook/test': existingVersion,
          storybook: existingVersion,
        },
      })
    );

    await initGenerator(tree, {});

    const packageJson = readJson(tree, 'package.json');
    expect(packageJson.devDependencies['@storybook/react-vite']).toBe(
      existingVersion
    );
  });

  it('should detect when @nx/storybook is already installed', async () => {
    const { ui } = require('../../utils/ui');

    tree.write(
      'package.json',
      JSON.stringify({
        name: 'test-workspace',
        devDependencies: {
          '@nx/storybook': '^22.0.0',
          '@storybook/react-vite': '^8.0.0',
          '@storybook/test': '^8.0.0',
          storybook: '^8.0.0',
        },
      })
    );

    await initGenerator(tree, {});

    expect(ui.success).toHaveBeenCalledWith(
      expect.stringContaining('@nx/storybook is installed')
    );
  });

  it('should warn when @nx/storybook is missing', async () => {
    const { ui } = require('../../utils/ui');

    tree.write(
      'package.json',
      JSON.stringify({
        name: 'test-workspace',
        devDependencies: {},
      })
    );

    await initGenerator(tree, {});

    expect(ui.warn).toHaveBeenCalledWith(
      expect.stringContaining('@nx/storybook is not installed')
    );
  });

  it('should respect skipFormat option', async () => {
    tree.write(
      'package.json',
      JSON.stringify({
        name: 'test-workspace',
        devDependencies: {
          '@nx/storybook': '^22.0.0',
        },
      })
    );

    await expect(
      initGenerator(tree, { skipFormat: true })
    ).resolves.not.toThrow();
  });

  it('should show the banner', async () => {
    const { ui } = require('../../utils/ui');

    tree.write(
      'package.json',
      JSON.stringify({
        name: 'test-workspace',
        devDependencies: { '@nx/storybook': '^22.0.0' },
      })
    );

    await initGenerator(tree, {});

    expect(ui.banner).toHaveBeenCalled();
  });
});
