import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger
} from '../tabs'

export function ManualTabs() {
  return (
    <TabsRoot activationMode="manual" defaultValue="settings">
      <TabsList>
        <TabsTrigger value="settings">Settings</TabsTrigger>
        <TabsTrigger value="billings">Billings</TabsTrigger>
        <TabsTrigger value="preferences" disabled>
          Preferences
        </TabsTrigger>
        <TabsTrigger value="shutdown">Shut Down</TabsTrigger>
      </TabsList>
      <TabsContent value="settings">Settings</TabsContent>
      <TabsContent value="billings">Billings</TabsContent>
      <TabsContent value="preferences">Preferences</TabsContent>
      <TabsContent value="shutdown">Shut Down</TabsContent>
    </TabsRoot>
  )
}
