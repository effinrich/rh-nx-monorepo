export interface WatchExecutorSchema {
  watchPaths: string[];
  ignore?: string[];
  debounceMs?: number;
  skipInteractionTests?: boolean;
}
