import { create } from 'zustand'

import {
  CallNoteFilterSelectedOptions,
  ResearchSprintFilterSelectedOptions
} from './types'

interface State {
  searchQuery?: string
  filterSelections?: ResearchSprintFilterSelectedOptions
  searchNotesQuery?: string
  notesFilterSelections?: CallNoteFilterSelectedOptions
  fetchNextResearch?: VoidFunction
  hasNextResearch?: boolean
  fetchNextNotes?: VoidFunction
  hasNextNotes?: boolean
}

interface Action {
  setSearchQuery: (searchQuery: State['searchQuery']) => void
  setFilterSelections: (filterSelections: State['filterSelections']) => void
  setNotesSearchQuery: (searchNotesQuery: State['searchNotesQuery']) => void
  setNotesFilterSelections: (
    notesFilterSelections: State['notesFilterSelections']
  ) => void
  setFetchNextResearch: (fetchNextResearch: State['fetchNextResearch']) => void
  setHasNextResearch: (hasNextResearch: State['hasNextResearch']) => void
  setFetchNextNotes: (fetchNextNotes: State['fetchNextNotes']) => void
  setHasNextNotes: (hasNextNotes: State['hasNextNotes']) => void
}

export const useResearchStore = create<State & Action>(set => ({
  searchQuery: '',
  filterSelections: undefined,
  searchNotesQuery: '',
  notesFilterSelections: undefined,
  fetchNextResearch: undefined,
  hasNextResearch: false,
  fetchNextNotes: undefined,
  hasNextNotes: false,
  setSearchQuery: searchQuery => set(() => ({ searchQuery })),
  setFilterSelections: filterSelections => set(() => ({ filterSelections })),
  setNotesSearchQuery: searchNotesQuery => set(() => ({ searchNotesQuery })),
  setNotesFilterSelections: notesFilterSelections =>
    set(() => ({ notesFilterSelections })),
  setFetchNextResearch: fetchNextResearch => set(() => ({ fetchNextResearch })),
  setHasNextResearch: hasNextResearch => set(() => ({ hasNextResearch })),
  setFetchNextNotes: fetchNextNotes => set(() => ({ fetchNextNotes })),
  setHasNextNotes: hasNextNotes => set(() => ({ hasNextNotes }))
}))
