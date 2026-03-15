import {
  Tree,
  formatFiles,
  readProjectConfiguration,
  getProjects,
} from '@nx/devkit';
import * as path from 'path';

import {
  COMPONENT_EXTENSIONS,
  IGNORED_FILES,
  STORY_FILE_SUFFIX,
} from '../../utils/constants';
import { ui } from '../../utils/ui';

import storyGenerator from '../story/generator';
import componentTestGenerator from '../component-test/generator';
import { analyzeComponent } from '../story/lib/analyze-component';
import { StoriesGeneratorSchema } from './schema';

/**
 * Bulk story generator — scans an entire project and generates stories
 * for every component that doesn't have one.
 *
 * Also produces a coverage report showing which components have stories,
 * which are missing, and a completeness score.
 */
export default async function storiesGenerator(
  tree: Tree,
  options: StoriesGeneratorSchema
): Promise<void> {
  const {
    project,
    skipInteractionTests = false,
    overwrite = false,
    dryRun = false,
    includeA11y = true,
    includeComponentTests = false,
  } = options;

  ui.banner();

  // Resolve the project
  ui.step(1, 4, 'Resolving project');

  let projectRoot: string;
  try {
    const config = readProjectConfiguration(tree, project);
    projectRoot = config.sourceRoot ?? config.root;
    ui.success(`Project: ${project} (${projectRoot})`);
  } catch {
    ui.error(`Project "${project}" not found in workspace.`);
    ui.hint('Run `nx show projects` to see available projects.');
    throw new Error(`Project "${project}" not found.`);
  }

  // Scan for components
  ui.step(2, 4, 'Scanning for components');

  const componentFiles = findComponentFiles(tree, projectRoot);
  const withStories: string[] = [];
  const withoutStories: string[] = [];
  const notAnalyzable: string[] = [];

  for (const file of componentFiles) {
    const storyPath = file.replace(/\.tsx?$/, STORY_FILE_SUFFIX);
    const analysis = analyzeComponent(tree, file);

    if (!analysis) {
      notAnalyzable.push(file);
      continue;
    }

    if (tree.exists(storyPath) && !overwrite) {
      withStories.push(file);
    } else {
      withoutStories.push(file);
    }
  }

  ui.info(`Found ${componentFiles.length} component files`);
  ui.success(`${withStories.length} already have stories`);
  if (withoutStories.length > 0) {
    ui.warn(`${withoutStories.length} missing stories`);
  }
  if (notAnalyzable.length > 0) {
    ui.skip(`${notAnalyzable.length} could not be analyzed (no exported component)`);
  }

  if (withoutStories.length === 0) {
    ui.done('All components have stories! Nothing to generate.');
    printCoverageScore(withStories.length, componentFiles.length);
    return;
  }

  // Generate stories
  ui.step(3, 4, `Generating ${withoutStories.length} stories`);

  let generated = 0;
  let failed = 0;

  for (const file of withoutStories) {
    try {
      await storyGenerator(tree, {
        componentPath: file,
        skipInteractionTests,
        overwrite,
        dryRun,
        _fromWatch: true, // suppress banner per-file
      });
      generated++;

      const relPath = file.replace(/\.tsx?$/, STORY_FILE_SUFFIX);
      ui.fileCreated(relPath);

      // Optionally generate Playwright component tests
      if (includeComponentTests) {
        try {
          await componentTestGenerator(tree, {
            componentPath: file,
            overwrite,
            dryRun,
          });
        } catch {
          // Non-fatal — story is the primary artifact
        }
      }
    } catch (err) {
      failed++;
      ui.error(`Failed: ${file} — ${(err as Error).message}`);
    }
  }

  // Coverage report
  ui.step(4, 4, 'Coverage report');

  const totalCovered = withStories.length + generated;
  const totalAnalyzable = componentFiles.length - notAnalyzable.length;

  printCoverageScore(totalCovered, totalAnalyzable);

  console.log('');
  ui.info(`Generated: ${generated}`);
  if (failed > 0) {
    ui.warn(`Failed: ${failed}`);
  }
  ui.info(`Already covered: ${withStories.length}`);
  ui.info(`Total components: ${totalAnalyzable}`);

  ui.done(
    dryRun
      ? 'Dry run complete — no files were written.'
      : `Generated ${generated} story files.`
  );

  if (!dryRun) {
    await formatFiles(tree);
  }
}

function findComponentFiles(tree: Tree, rootPath: string): string[] {
  const files: string[] = [];

  function walk(dir: string): void {
    const children = tree.children(dir);
    for (const child of children) {
      const fullPath = `${dir}/${child}`;

      if (tree.isFile(fullPath)) {
        const ext = path.extname(child);
        if (!COMPONENT_EXTENSIONS.includes(ext)) continue;
        if (isIgnored(child)) continue;
        files.push(fullPath);
      } else {
        // Skip node_modules, dist, etc.
        if (
          child === 'node_modules' ||
          child === 'dist' ||
          child === '.storybook' ||
          child.startsWith('.')
        ) {
          continue;
        }
        walk(fullPath);
      }
    }
  }

  walk(rootPath);
  return files;
}

function isIgnored(fileName: string): boolean {
  for (const pattern of IGNORED_FILES) {
    const regex = pattern.replace(/\./g, '\\.').replace(/\*/g, '.*');
    if (new RegExp(`^${regex}$`).test(fileName)) {
      return true;
    }
  }
  return false;
}

function printCoverageScore(covered: number, total: number): void {
  if (total === 0) {
    ui.info('No analyzable components found.');
    return;
  }

  const pct = Math.round((covered / total) * 100);

  let color: 'success' | 'warn' | 'error';
  let grade: string;

  if (pct >= 90) {
    color = 'success';
    grade = 'A';
  } else if (pct >= 75) {
    color = 'success';
    grade = 'B';
  } else if (pct >= 50) {
    color = 'warn';
    grade = 'C';
  } else if (pct >= 25) {
    color = 'warn';
    grade = 'D';
  } else {
    color = 'error';
    grade = 'F';
  }

  ui.separator();
  console.log('');
  const method = color === 'success' ? 'success' : color === 'warn' ? 'warn' : 'error';
  ui[method](
    `Story Coverage: ${pct}% (${covered}/${total}) — Grade: ${grade}`
  );
}
