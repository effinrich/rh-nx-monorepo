import { Avatar, Button, Text } from '@redesignhealth/ui'

import type { Meta, StoryObj } from '@storybook/react'

import { ListCard } from './list-card'
import { ListCardHeader } from './list-card-header'
import { ListCardRow } from './list-card-row'
import { ListCardRowsContainer } from './list-card-rows-container'
import { ListCardTags } from './list-card-tags'

const Story: Meta<typeof ListCard> = {
  component: ListCard,
  title: 'Components / ListCard'
}
export default Story

export const Default: StoryObj<typeof ListCard> = {
  render: () => {
    return (
      <ListCard>
        <ListCardHeader
          leftAddon={<Avatar src="https://placekitten.com/200/200" />}
          title="Title information"
          subtitle={<Text>Subtitle</Text>}
        />
        <ListCardRowsContainer>
          <ListCardRow title="Row 1">
            <Text>Text</Text>
          </ListCardRow>
          <ListCardRow title="Row 2">
            <ListCardTags values={['tag 1', 'tag 2', 'tag 3']} />
          </ListCardRow>
          <ListCardRow
            title="Row 3"
            rightElement={
              <Button variant="outline" onClick={() => alert('Clicked')}>
                Click me
              </Button>
            }
          >
            Details
          </ListCardRow>
        </ListCardRowsContainer>
      </ListCard>
    )
  }
}
