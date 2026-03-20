// @effinrich/nx-storybook — Nx plugin for automated Storybook story generation
//
// Generators:
//   init           — Initialize the plugin in your workspace (auto-runs on `nx add`)
//   story          — Generate a Storybook story with interaction tests for a component
//   stories        — Bulk generate stories for all components in a project
//   component-test — Generate a co-located Playwright component test
//
// Executors:
//   watch — Watch component directories and auto-generate/update stories

export { default as initGenerator } from './generators/init/generator';
export { default as storyGenerator } from './generators/story/generator';
export { default as storiesGenerator } from './generators/stories/generator';
export { default as componentTestGenerator } from './generators/component-test/generator';
export { default as watchExecutor } from './executors/watch/executor';

// Re-export utilities for programmatic use
export { analyzeComponent } from './generators/story/lib/analyze-component';
export { generateStoryContent } from './generators/story/lib/generate-story-content';
export { generateInteractionTests } from './generators/story/lib/generate-interaction-tests';
export { generatePlaywrightTest } from './generators/component-test/lib/generate-playwright-test';

// Types
export type { ComponentAnalysis, PropInfo, ImportInfo } from './utils/types';
export type { StoryGeneratorSchema } from './generators/story/schema';
export type { StoriesGeneratorSchema } from './generators/stories/schema';
export type { ComponentTestGeneratorSchema } from './generators/component-test/schema';
export type { InitGeneratorSchema } from './generators/init/schema';
export type { WatchExecutorSchema } from './executors/watch/schema';
