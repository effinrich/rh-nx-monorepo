import { Helmet } from 'react-helmet'
import { AddResearchSprintPage, Page } from '@redesignhealth/portal/ui'

export const AddResearchSprint = () => {
  return (
    <Page>
      <Helmet>
        <title>Add Research Sprint</title>
      </Helmet>
      <AddResearchSprintPage />
    </Page>
  )
}
