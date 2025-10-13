import { create } from 'zustand'

interface State {
  currentModuleTitle: string
  currentModuleDesc: string
}

interface Action {
  setCurrentModuleTitle: (moduleTitle: State['currentModuleTitle']) => void
  setCurrentModuleDesc: (moduleDesc: State['currentModuleDesc']) => void
}

// Create your store, which includes both state and (optionally) actions
export const useModuleStore = create<State & Action>(set => ({
  currentModuleTitle: '',
  currentModuleDesc: '',
  setCurrentModuleTitle: currentModuleTitle =>
    set(() => ({ currentModuleTitle })),
  setCurrentModuleDesc: currentModuleDesc => set(() => ({ currentModuleDesc }))
}))
