import { rh } from '../../rh/rh'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger
} from '../tabs'

const sizes = ['sm', 'md', 'lg'] as const

export function SizesTabs() {
  return (
    <>
      {sizes.map(size => (
        <rh.div key={size} my="10">
          <pre>size = {size}</pre>
          <TabsRoot size={size} mt="3" defaultValue="settings">
            <TabsList>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="billings">Billings</TabsTrigger>
            </TabsList>
            <TabsContent value="settings">Settings</TabsContent>
            <TabsContent value="billings">Billings</TabsContent>
          </TabsRoot>
        </rh.div>
      ))}
    </>
  )
}
