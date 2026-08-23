import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger
} from '../tabs'

export function WithIndicatorTabs() {
  return (
    <TabsRoot unstyled activationMode="manual" defaultValue="settings">
      <TabsList>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger
          value="billings"
          _disabled={{ color: 'gray.400' }}
          disabled
        >
          Billings
        </TabsTrigger>
        <TabsTrigger value="preferences">Preferences</TabsTrigger>
        <TabsTrigger value="shutdown">Shut Down</TabsTrigger>
      </TabsList>

      <TabsIndicator mt="-36px" zIndex={-1} height="34px" bg="green.200" />

      <TabsContent value="settings">Settings</TabsContent>
      <TabsContent value="billings">Billings</TabsContent>
      <TabsContent value="preferences">Preferences</TabsContent>
      <TabsContent value="shutdown">Shut Down</TabsContent>
    </TabsRoot>
  )
}
