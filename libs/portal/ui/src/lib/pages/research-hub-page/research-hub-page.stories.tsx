import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react'

import { callNoteFilterOptions, notes } from './mocks/notes'
import { researchSprintFilterOptions, sprints } from './mocks/sprints'
import { ResearchHubPage } from './research-hub-page'

const Story: Meta<typeof ResearchHubPage> = {
  component: ResearchHubPage,
  title: 'pages/Research Hub',
  decorators: [withRouter],
  args: {},
  render: () => (
    <ResearchHubPage
      sprints={sprints}
      isLoadingSprints={false}
      researchSprintFilterOptions={researchSprintFilterOptions}
      notes={notes}
      isLoadingNotes={false}
      callNoteFilterOptions={callNoteFilterOptions}
    />
  )
}
export default Story

export const Default = {}
