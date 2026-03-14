import { ExecutorContext, logger, workspaceRoot } from '@nx/devkit';
import { FsTree } from 'nx/src/generators/tree';
import * as path from 'path';
import * as fs from 'fs';

import {
  COMPONENT_EXTENSIONS,
  DEFAULT_DEBOUNCE_MS,
  IGNORED_FILES,
  STORY_FILE_SUFFIX,
} from '../../utils/constants';
import { ui } from '../../utils/ui';

import storyGenerator from '../../generators/story/generator';
import { WatchExecutorSchema } from './schema';

/**
 * Executor that watches component directories for changes and
 * auto-generates/updates Storybook stories.
 */
export default async function watchExecutor(
  options: WatchExecutorSchema,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  const {
    watchPaths,
    ignore = IGNORED_FILES,
    debounceMs = DEFAULT_DEBOUNCE_MS,
    skipInteractionTests = false,
  } = options;

  ui.banner();

  const resolvedPaths = watchPaths.map((p) => path.resolve(workspaceRoot, p));

  // Validate watch paths exist
  for (const watchPath of resolvedPaths) {
    if (!fs.existsSync(watchPath)) {
      ui.warn(`Watch path does not exist: ${watchPath}`);
    }
  }

  ui.info(`Watching for component changes in:`);
  for (const wp of watchPaths) {
    console.log(`      ${ui.command(wp)}`);
  }
  console.log('');
  ui.hint('Press Ctrl+C to stop.');
  console.log('');

  // Debounce map to coalesce rapid changes
  const pending = new Map<string, NodeJS.Timeout>();

  const handleFileChange = (filePath: string) => {
    // Skip non-component files
    const ext = path.extname(filePath);
    if (!COMPONENT_EXTENSIONS.includes(ext)) return;

    // Skip ignored patterns
    const fileName = path.basename(filePath);
    if (isIgnored(fileName, ignore)) return;

    // Skip if story file already (don't recursively trigger)
    if (filePath.includes('.stories.')) return;

    // Debounce
    if (pending.has(filePath)) {
      clearTimeout(pending.get(filePath)!);
    }

    pending.set(
      filePath,
      setTimeout(async () => {
        pending.delete(filePath);
        await processFileChange(filePath, skipInteractionTests);
      }, debounceMs)
    );
  };

  // Use fs.watch for each directory (recursive)
  const watchers: fs.FSWatcher[] = [];

  for (const watchPath of resolvedPaths) {
    if (!fs.existsSync(watchPath)) continue;

    try {
      const watcher = fs.watch(
        watchPath,
        { recursive: true },
        (eventType, filename) => {
          if (!filename) return;
          const fullPath = path.join(watchPath, filename);
          handleFileChange(fullPath);
        }
      );

      watcher.on('error', (err) => {
        ui.error(`Watcher error on ${watchPath}: ${err.message}`);
      });

      watchers.push(watcher);
    } catch (err) {
      ui.error(
        `Failed to watch ${watchPath}: ${(err as Error).message}`
      );
    }
  }

  if (watchers.length === 0) {
    ui.error('No valid watch paths found. Exiting.');
    return { success: false };
  }

  ui.success(`Watching ${watchers.length} path(s) for changes...`);

  // Keep the executor alive until terminated
  return new Promise<{ success: boolean }>((resolve) => {
    const cleanup = () => {
      for (const watcher of watchers) {
        watcher.close();
      }
      for (const timeout of pending.values()) {
        clearTimeout(timeout);
      }
      console.log('');
      ui.info('Stopped watching for changes.');
      resolve({ success: true });
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  });
}

async function processFileChange(
  absolutePath: string,
  skipInteractionTests: boolean
): Promise<void> {
  const relativePath = path.relative(workspaceRoot, absolutePath);

  // Check if story already exists
  const storyPath = absolutePath.replace(/\.tsx?$/, STORY_FILE_SUFFIX);
  const storyExists = fs.existsSync(storyPath);

  ui.separator();
  if (storyExists) {
    ui.info(`Updating story for: ${relativePath}`);
  } else {
    ui.info(`Generating story for: ${relativePath}`);
  }

  try {
    // Create a fresh tree from the filesystem for each change
    const tree = new FsTree(workspaceRoot, false);

    await storyGenerator(tree, {
      componentPath: relativePath,
      skipInteractionTests,
      overwrite: true,
      _fromWatch: true,
    });

    // Flush tree changes to disk
    const changes = tree.listChanges();
    for (const change of changes) {
      if (change.type === 'CREATE' || change.type === 'UPDATE') {
        const dir = path.dirname(
          path.join(workspaceRoot, change.path)
        );
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(
          path.join(workspaceRoot, change.path),
          change.content!
        );
      }
    }

    const storyRelative = relativePath.replace(/\.tsx?$/, STORY_FILE_SUFFIX);
    if (storyExists) {
      ui.fileUpdated(storyRelative);
    } else {
      ui.fileCreated(storyRelative);
    }
  } catch (err) {
    ui.error(
      `Failed to generate story for ${relativePath}: ${(err as Error).message}`
    );
  }
}

function isIgnored(fileName: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    // Convert glob-like patterns to simple matching
    const regex = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*');
    if (new RegExp(`^${regex}$`).test(fileName)) {
      return true;
    }
  }
  return false;
}
