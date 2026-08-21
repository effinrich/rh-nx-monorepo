import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger
} from '../tabs'

import { Interval } from './interval'

export function WithLazyTabs() {
  return (
    <TabsRoot defaultValue="1" lazyMount unmountOnExit>
      <TabsList>
        <TabsTrigger value="1">Interval 1</TabsTrigger>
        <TabsTrigger value="2">Interval 2</TabsTrigger>
      </TabsList>
      <TabsContent value="1">
        Interval 1:
        <Interval />
      </TabsContent>
      <TabsContent value="2">
        Interval 2:
        <Interval />
      </TabsContent>
    </TabsRoot>
  )
}
