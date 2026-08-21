import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger
} from '../tabs'

interface TabViewItem {
  id: string
  value: number
}

interface TabViewProps {
  items: TabViewItem[]
  selectedItemId: string
  setSelectedItemId: (id: string) => void
}

export function TabView({
  items,
  selectedItemId,
  setSelectedItemId
}: TabViewProps) {
  return (
    <TabsRoot
      value={selectedItemId}
      onValueChange={details => setSelectedItemId(details.value)}
      orientation="vertical"
      variant="enclosed-colored"
    >
      <TabsList minW="100px">
        {items.map(x => (
          <TabsTrigger key={x.id} value={x.id}>
            {x.id}: {x.value}
          </TabsTrigger>
        ))}
      </TabsList>
      {items.map(x => (
        <TabsContent key={x.id} value={x.id}>
          {x.id}: {x.value}
        </TabsContent>
      ))}
    </TabsRoot>
  )
}
