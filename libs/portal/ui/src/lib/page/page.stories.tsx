import { Box, SectionHeader } from '@redesignhealth/ui'

import type { Meta } from '@storybook/react-vite'

import Page, { PageProps } from './page'

const Story: Meta<typeof Page> = {
  component: Page,
  title: 'Components / Page',
  args: {}
}
export default Story

export const Default = {
  render: (args: PageProps) => (
    <Page {...args}>
      <SectionHeader title="Title" helpText="Subtitle" />
      <Box h="100vh" bg="purple.200">
        Content
      </Box>
    </Page>
  )
}
