export interface StoryGeneratorSchema {
  componentPath: string;
  project?: string;
  storyTitle?: string;
  skipInteractionTests?: boolean;
  overwrite?: boolean;
  dryRun?: boolean;
  /** @internal Used by the watch executor to suppress banner output */
  _fromWatch?: boolean;
}
