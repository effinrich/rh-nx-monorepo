import { Tree, formatFiles } from '@nx/devkit';
import * as path from 'path';

import {
  COMPONENT_EXTENSIONS,
  STORY_FILE_SUFFIX,
} from '../../utils/constants';
import { ui } from '../../utils/ui';

import { analyzeComponent } from '../story/lib/analyze-component';
import { generatePlaywrightTest } from './lib/generate-playwright-test';
import { ComponentTestGeneratorSchema } from './schema';

const CT_FILE_SUFFIX = '.ct.tsx';

/**
 * Nx generator that creates a co-located Playwright component test
 * file next to a React component and its stories.
 *
 * The test:
 * - Mounts the component directly using @playwright/experimental-ct-react
 * - Tests rendering, visual appearance, interaction, and accessibility
 * - Lives alongside the component (.ct.tsx next to .stories.tsx)
 */
export default async function componentTestGenerator(
  tree: Tree,
  options: ComponentTestGeneratorSchema
): Promise<void> {
  const { componentPath, overwrite, dryRun } = options;

  ui.banner();

  // Resolve the component file
  const resolvedPath = resolveComponentPath(tree, componentPath);
  if (!resolvedPath) {
    ui.error(`Component file not found: ${componentPath}`);
    ui.hint(
      'Ensure the path is relative to the workspace root and points to a .tsx or .ts file.'
    );
    throw new Error(`Component file not found: ${componentPath}`);
  }

  // Check for existing test
  const testPath = resolvedPath.replace(/\.tsx?$/, CT_FILE_SUFFIX);
  if (tree.exists(testPath) && !overwrite) {
    ui.fileSkipped(testPath);
    ui.hint('Use --overwrite to replace it.');
    return;
  }

  // Analyze the component
  ui.step(1, 3, 'Analyzing component');

  const analysis = analyzeComponent(tree, resolvedPath);
  if (!analysis) {
    ui.error(`Could not analyze component at ${resolvedPath}`);
    throw new Error(`Could not analyze component at ${resolvedPath}`);
  }

  // Check if a story file exists (we reference it for story-driven tests)
  const storyPath = resolvedPath.replace(/\.tsx?$/, STORY_FILE_SUFFIX);
  const hasStories = tree.exists(storyPath);

  // Generate test content
  ui.step(2, 3, 'Generating Playwright component test');

  const content = generatePlaywrightTest({
    analysis,
    importPath: `./${analysis.fileName}`,
    hasStories,
    storyImportPath: hasStories
      ? `./${path.basename(storyPath, '.tsx')}`
      : undefined,
  });

  if (dryRun) {
    ui.info('Dry run — no files will be written.');
    ui.separator();
    console.log(content);
    ui.separator();
    return;
  }

  // Write the test file
  ui.step(3, 3, 'Writing file');

  tree.write(testPath, content);

  if (tree.exists(testPath) && overwrite) {
    ui.fileUpdated(testPath);
  } else {
    ui.fileCreated(testPath);
  }

  ui.analysisReport({
    name: analysis.name,
    propsCount: analysis.props.length,
    hasChildren: analysis.hasChildren,
    usesRouter: analysis.usesRouter,
    usesChakra: analysis.usesChakra,
    usesReactQuery: analysis.usesReactQuery,
    exportType: analysis.exportType,
    storiesGenerated: [
      'mounts and renders',
      'matches screenshot',
      ...(analysis.props.some((p) => p.isCallback) ? ['handles interactions'] : []),
      ...(analysis.props.some((p) => p.name === 'disabled')
        ? ['disabled state']
        : []),
      'meets a11y standards',
      ...(hasStories ? ['story-driven tests'] : []),
    ],
  });

  ui.done(`Playwright test generated at ${testPath}`);

  await formatFiles(tree);
}

function resolveComponentPath(
  tree: Tree,
  componentPath: string
): string | null {
  if (tree.exists(componentPath)) return componentPath;
  for (const ext of COMPONENT_EXTENSIONS) {
    const withExt = componentPath + ext;
    if (tree.exists(withExt)) return withExt;
  }
  return null;
}
