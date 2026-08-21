import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger
} from '../tabs'

export function WithTabPanelWrapperTabs() {
  return (
    <TabsRoot defaultValue="first">
      <TabsList>
        <TabsTrigger value="first">FIrst Tab</TabsTrigger>
        <TabsTrigger value="second">Second Tab</TabsTrigger>
        <TabsTrigger value="third">Third Tab</TabsTrigger>
      </TabsList>
      <TabsContent value="first">Tab panel 1</TabsContent>
      <TabsContent value="second">Tab panel 2</TabsContent>
      <TabsContent value="third">Tab panel 3</TabsContent>
    </TabsRoot>
  )
}
