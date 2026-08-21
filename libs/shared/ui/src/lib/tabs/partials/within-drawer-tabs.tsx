import {
  DrawerBackdrop,
  DrawerBody,
  DrawerContent,
  DrawerPositioner,
  DrawerRoot
} from '../../drawer/drawer'
import {
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsRoot,
  TabsTrigger
} from '../tabs'

export function WithinDrawerTabs() {
  return (
    <DrawerRoot open onOpenChange={console.log}>
      <DrawerBackdrop />
      <DrawerPositioner>
        <DrawerContent>
          <DrawerBody>
            <TabsRoot
              variant="unstyled"
              activationMode="manual"
              defaultValue="settings"
            >
              <TabsList>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="billings">Billings</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>

              <TabsIndicator zIndex={-1} height="4px" bg="green.200" />

              <TabsContent value="settings">Settings</TabsContent>
              <TabsContent value="billings">Billings</TabsContent>
              <TabsContent value="preferences">Preferences</TabsContent>
            </TabsRoot>
          </DrawerBody>
        </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  )
}
