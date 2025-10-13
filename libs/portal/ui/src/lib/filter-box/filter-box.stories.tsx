import type { Meta } from '@storybook/react'

import Filter from './filter'
import { FilterBox, FilterBoxProps } from './filter-box'
import Filters from './filters'
import Search from './search'

const Story: Meta<typeof FilterBox> = {
  component: FilterBox,
  title: 'Components/FilterBox'
}
export default Story

const noOp = () => ''
export const Default = {
  args: {
    title: 'Looking for references on vendors?',
    description: `Redesign Health facilitates a vendor network amongst OpCos where you can share your experiences with each other. To begin, search for a vendor and we'll show you who to talk with. If you don’t see a vendor on this list, contact your Relationship Manager.`,
    children: (
      <>
        <Search onChange={noOp} />
        <Filters handleClear={noOp}>
          <Filter placeholder="Filter 1" />
          <Filter placeholder="Filter 2" />
        </Filters>
      </>
    )
  } as FilterBoxProps
}
