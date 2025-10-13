import { HighlightedText } from '../types'

export interface ResearchSprintCardProps {
  title?: string
  sprintAuthor?: string
  sprintDate?: string
  groupType?: 'newco' | 'company' | 'concept' | 'theme'
  groupStage?: string
  groupName?: string
  groupDescription?: string
  isConflict?: boolean
  objectives?: Array<string>
  services?: Array<string>
  method?: string
  segments?: Array<string>
  taxonomy?: Array<string>
  reportLink?: string
  created?: string
  supportingFiles?: Array<{ name?: string; href?: string }>
  highlightedText: HighlightedText
}

export type ResearchSprintWithId = ResearchSprintCardProps & {
  id: string
}

export type ResearchSprintFilterName = Extract<
  keyof ResearchSprintCardProps,
  'groupName' | 'sprintAuthor' | 'services' | 'method' | 'segments' | 'taxonomy'
>

export type ResearchSprintFilterOptions = Record<
  ResearchSprintFilterName,
  Array<string | undefined>
>

export type ResearchSprintFilterSelectedOptions = Record<
  ResearchSprintFilterName,
  Array<string>
>

export interface CallNoteCardProps {
  intervieweeName?: string
  intervieweeCompany?: string
  noteAuthor?: string
  noteDate?: string
  noteLink?: string
  type?: string
  isConflict?: boolean
  linkedInProfileHref?: string
  tags?: Array<string>
  additionalTags?: Array<string>
  interviewSource?: string
  stakeholders?: Array<string>
  intervieweeEmail?: string
  taxonomies?: Array<string>
  attachmentName?: string
  attachmentLink?: string
  groupStage?: string
  groupName?: string
  groupDescription?: string
  created?: string
  highlightedText: HighlightedText
  attachments?: Array<{ href: string; name: string }>
}

export type CallNoteWithId = CallNoteCardProps & { id: string }

export type CallNoteFilterName = Extract<
  keyof CallNoteCardProps,
  'groupName' | 'stakeholders' | 'noteAuthor' | 'tags' | 'taxonomies'
>

export type CallNoteFilterOptions = Record<CallNoteFilterName, string[]>

export type CallNoteFilterSelectedOptions = Record<
  CallNoteFilterName,
  Array<string>
>
