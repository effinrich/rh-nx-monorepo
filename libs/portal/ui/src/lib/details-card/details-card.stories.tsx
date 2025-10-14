import { MdAlternateEmail } from 'react-icons/md'
import { Button, Tab, TabList, Tabs, Text } from '@redesignhealth/ui'
import { withRouter } from 'storybook-addon-react-router-v6'

import type { Meta } from '@storybook/react-vite'

import { ListCardTags } from '../list-card/list-card-tags'

import DetailsCard from './details-card'
import DetailsCardBody from './details-card-body'
import DetailsCardHeader from './details-card-header'
import DetailsCardRow from './details-card-row'
import DetailsCardRowLink from './details-card-row-link'

const Story: Meta<typeof DetailsCard> = {
  component: DetailsCard,
  title: 'components / DetailsCard',
  decorators: [withRouter],

  args: {}
}

export default Story

export const Default = {
  render: () => {
    return (
      <DetailsCard>
        <DetailsCardHeader
          title="Title information"
          backButtonText="Back to destination"
          subtitle={<Text>Subtitle</Text>}
        />
        <DetailsCardBody>
          <DetailsCardRow title="Row 1">Details</DetailsCardRow>
          <DetailsCardRow title="Row 2">
            <DetailsCardRowLink href="https://example.com" />
          </DetailsCardRow>
          <DetailsCardRow title="Row 3">
            <ListCardTags values={['tag 1', 'tag 2', 'tag 3']} />
          </DetailsCardRow>
          <DetailsCardRow
            title="Row with CTA 3"
            rightElement={
              <Button variant="outline" onClick={() => alert('Clicked')}>
                Click me
              </Button>
            }
          >
            Details
          </DetailsCardRow>
        </DetailsCardBody>
      </DetailsCard>
    )
  }
}

export const WithTabs = {
  render: () => {
    return (
      <DetailsCard>
        <DetailsCardHeader
          title="Title information"
          backButtonText="Back to destination"
          // avatarHref="https://placekitten.com/200/200"
          subtitle={<Text>Subtitle</Text>}
        />
        <Tabs colorScheme="primary">
          <TabList>
            <Tab>Details</Tab>
            <Tab>Users</Tab>
          </TabList>
        </Tabs>
        <DetailsCardBody>
          <DetailsCardRow title="Row 1">Details</DetailsCardRow>
          <DetailsCardRow title="Row 2">
            <DetailsCardRowLink href="https://example.com" />
          </DetailsCardRow>
          <DetailsCardRow title="Row 3">
            <ListCardTags values={['tag 1', 'tag 2', 'tag 3']} />
          </DetailsCardRow>
        </DetailsCardBody>
      </DetailsCard>
    )
  }
}
