import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger
} from '../tabs'

export function WithIndicatorAndLongTabTextTabs() {
  return (
    <TabsRoot unstyled activationMode="manual" defaultValue="long">
      <TabsList>
        <TabsTrigger value="long">Tab with long text</TabsTrigger>
        <TabsTrigger value="billings">Billings</TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="shutdown">Shut Down</TabsTrigger>
      </TabsList>
      <TabsIndicator mt="-36px" zIndex={-1} height="34px" bg="green.200" />
      <TabsContent value="long">Tab with long text</TabsContent>
      <TabsContent value="billings">Billings</TabsContent>
      <TabsContent value="preferences">Preferences</TabsContent>
      <TabsContent value="shutdown">Shut Down</TabsContent>
    </TabsRoot>
  )
}
