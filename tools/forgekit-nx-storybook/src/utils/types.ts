export interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
  isCallback: boolean;
  unionValues?: string[];
}

export interface ComponentAnalysis {
  name: string;
  fileName: string;
  filePath: string;
  props: PropInfo[];
  hasChildren: boolean;
  imports: ImportInfo[];
  usesRouter: boolean;
  usesReactQuery: boolean;
  usesChakra: boolean;
  exportType: 'default' | 'named' | 'both';
}

export interface ImportInfo {
  source: string;
  specifiers: string[];
}

export interface StoryGeneratorOptions {
  componentPath: string;
  project?: string;
  storyTitle?: string;
  skipInteractionTests?: boolean;
  overwrite?: boolean;
  dryRun?: boolean;
}

export interface WatchExecutorOptions {
  watchPaths: string[];
  ignore?: string[];
  debounceMs?: number;
  skipInteractionTests?: boolean;
}

export interface LibraryConfig {
  name: string;
  root: string;
  importAlias: string;
  storyTitlePrefix: string;
}
