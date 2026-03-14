import {
  Tree,
  formatFiles,
  logger,
  workspaceRoot,
} from '@nx/devkit';
import * as path from 'path';

import { COMPONENT_EXTENSIONS, STORY_FILE_SUFFIX } from '../../utils/constants';
import { ui } from '../../utils/ui';

import { analyzeComponent } from './lib/analyze-component';
import { generateStoryContent } from './lib/generate-story-content';
import { StoryGeneratorSchema } from './schema';

/**
 * Nx generator that creates a Storybook story file with interaction tests
 * for a given React component.
 */
export default async function storyGenerator(
  tree: Tree,
  options: StoryGeneratorSchema
): Promise<void> {
  const { componentPath, skipInteractionTests, overwrite, dryRun } = options;

  // Show banner only when running directly (not from watch executor)
  const isInteractive = !options._fromWatch;
  if (isInteractive) {
    ui.banner();
  }

  // Resolve the component file
  const resolvedPath = resolveComponentPath(tree, componentPath);
  if (!resolvedPath) {
    ui.error(
      `Component file not found: ${componentPath}`
    );
    ui.hint('Ensure the path is relative to the workspace root and points to a .tsx or .ts file.');
    throw new Error(`Component file not found: ${componentPath}`);
  }

  // Check for existing story
  const storyPath = resolvedPath.replace(/\.tsx?$/, STORY_FILE_SUFFIX);
  if (tree.exists(storyPath) && !overwrite) {
    ui.fileSkipped(storyPath);
    ui.hint('Use --overwrite to replace it.');
    return;
  }

  // Analyze the component
  if (isInteractive) {
    ui.step(1, 3, 'Analyzing component');
  }

  const analysis = analyzeComponent(tree, resolvedPath);
  if (!analysis) {
    ui.error(`Could not analyze component at ${resolvedPath}`);
    ui.hint('Ensure it exports a React component (named or default export).');
    throw new Error(`Could not analyze component at ${resolvedPath}`);
  }

  // Determine story title
  const storyTitle =
    options.storyTitle ?? inferStoryTitle(resolvedPath, options.project);

  // Determine import path (relative from story to component)
  const importPath = `./${analysis.fileName}`;

  // Generate story content
  if (isInteractive) {
    ui.step(2, 3, 'Generating story');
  }

  const content = generateStoryContent({
    analysis,
    storyTitle,
    importPath,
    skipInteractionTests: skipInteractionTests ?? false,
  });

  // Collect which stories were generated for the report
  const storiesGenerated = ['Default'];
  if (analysis.props.some((p) => p.name === 'size' && p.unionValues?.length)) {
    storiesGenerated.push('Sizes');
  }
  if (analysis.props.some((p) => p.name === 'variant' && p.unionValues?.length)) {
    storiesGenerated.push('Variants');
  }
  if (analysis.props.some((p) => p.name === 'colorPalette' && p.unionValues?.length)) {
    storiesGenerated.push('ColorPalettes');
  }
  if (analysis.props.some((p) => p.name === 'disabled' || p.name === 'isDisabled')) {
    storiesGenerated.push('Disabled');
  }
  if (!skipInteractionTests) {
    storiesGenerated.push('RendersCorrectly');
    if (analysis.props.some(
      (p) => p.isCallback && ['onClick', 'onPress', 'onSubmit', 'onClose'].includes(p.name)
    )) {
      storiesGenerated.push('ClickInteraction', 'KeyboardNavigation');
    }
  }

  if (dryRun) {
    ui.info('Dry run — no files will be written.');
    ui.separator();
    console.log(content);
    ui.separator();
    return;
  }

  // Write the story file
  if (isInteractive) {
    ui.step(3, 3, 'Writing file');
  }

  tree.write(storyPath, content);

  if (tree.exists(storyPath) && overwrite) {
    ui.fileUpdated(storyPath);
  } else {
    ui.fileCreated(storyPath);
  }

  // Show analysis report
  if (isInteractive) {
    ui.analysisReport({
      name: analysis.name,
      propsCount: analysis.props.length,
      hasChildren: analysis.hasChildren,
      usesRouter: analysis.usesRouter,
      usesChakra: analysis.usesChakra,
      usesReactQuery: analysis.usesReactQuery,
      exportType: analysis.exportType,
      storiesGenerated,
    });

    ui.done(`Story generated at ${storyPath}`);
  }

  // Format
  await formatFiles(tree);
}

/**
 * Resolve a component path, trying common extensions if needed.
 */
function resolveComponentPath(tree: Tree, componentPath: string): string | null {
  // Direct path
  if (tree.exists(componentPath)) return componentPath;

  // Try with extensions
  for (const ext of COMPONENT_EXTENSIONS) {
    const withExt = componentPath + ext;
    if (tree.exists(withExt)) return withExt;
  }

  return null;
}

/**
 * Infer a Storybook title from the file path.
 *
 * Examples:
 *   libs/shared/ui/src/lib/button/button.tsx → "Components / Button"
 *   libs/portal/ui/src/lib/pages/ceo-directory-page/ceo-card/ceo-card.tsx
 *     → "Portal / Pages / CeoDirectoryPage / CeoCard"
 */
function inferStoryTitle(filePath: string, project?: string): string {
  // Extract segments between /lib/ and the file name
  const libMatch = filePath.match(/\/lib\/(.+)\//);
  if (!libMatch) {
    // Fallback: use the file name
    const fileName = path.basename(filePath, path.extname(filePath));
    return `Components / ${toPascalCase(fileName)}`;
  }

  const segments = libMatch[1].split('/');
  const parts = segments.map((seg) => toPascalCase(seg));

  // Determine the library prefix
  let prefix = 'Components';
  if (filePath.includes('/portal/')) {
    prefix = 'Portal';
  } else if (filePath.includes('/third-party-network/')) {
    prefix = 'Third Party Network';
  } else if (filePath.includes('/shared/ui/')) {
    prefix = 'Components';
  }

  // Deduplicate consecutive identical segments
  const deduped = [prefix];
  for (const part of parts) {
    if (part !== deduped[deduped.length - 1]) {
      deduped.push(part);
    }
  }

  return deduped.join(' / ');
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}
