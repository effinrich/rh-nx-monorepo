export interface StoriesGeneratorSchema {
  project: string;
  skipInteractionTests?: boolean;
  overwrite?: boolean;
  dryRun?: boolean;
  includeA11y?: boolean;
  includeComponentTests?: boolean;
}
