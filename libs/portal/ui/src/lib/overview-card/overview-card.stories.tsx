import {
  Button,
  Center,
  Stack,
  TableRoot,
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHeader,
  TableRow
} from '@redesignhealth/ui'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { ListCard } from '../list-card/list-card'
import { ListCardHeader } from '../list-card/list-card-header'
import { ListCardRow } from '../list-card/list-card-row'
import { ListCardRowsContainer } from '../list-card/list-card-rows-container'

import OverviewCard from './overview-card'

const Story: Meta<typeof OverviewCard> = {
  component: OverviewCard,
  title: 'Components/OverviewCard',
  args: {
    title: 'Title',
    description: 'More information',
    rightElement: (
      <Button colorPalette="primary" onClick={() => alert('Clicked')}>
        CTA
      </Button>
    )
  }
}
export default Story

export const Default: StoryObj<typeof OverviewCard> = {
  args: {},
  render: args => (
    <OverviewCard {...args}>
      <Center>Empty State</Center>
    </OverviewCard>
  )
}

const mockItem = {
  type: 'Fruit',
  color: 'Orange',
  season: 'Spring'
}
export const WithCards: StoryObj<typeof OverviewCard> = {
  args: {},
  render: args => (
    <OverviewCard {...args}>
      <Stack gap={6}>
        {new Array(2).fill(mockItem).map(item => (
          <ListCard key={item.type}>
            <ListCardHeader title="Item" />
            <ListCardRowsContainer>
              <ListCardRow title="Fruit">{item.type}</ListCardRow>
              <ListCardRow title="Color">{item.color}</ListCardRow>
              <ListCardRow title="Season">{item.season}</ListCardRow>
            </ListCardRowsContainer>
          </ListCard>
        ))}
      </Stack>
    </OverviewCard>
  )
}

export const WithTable: StoryObj<typeof OverviewCard> = {
  args: {},
  render: args => (
    <OverviewCard {...args}>
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableColumnHeader>Type</TableColumnHeader>
            <TableColumnHeader>Color</TableColumnHeader>
            <TableColumnHeader>Season</TableColumnHeader>
          </TableRow>
        </TableHeader>
        <TableBody>
          {new Array(2).fill(mockItem).map(item => (
            <TableRow key={item.type}>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.color}</TableCell>
              <TableCell>{item.season}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </OverviewCard>
  )
}
