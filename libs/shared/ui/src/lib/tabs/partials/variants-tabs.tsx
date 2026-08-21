import { rh } from '../../rh/rh'
import {
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger
} from '../tabs'

const variants = [
  'line',
  'enclosed',
  'enclosed-colored',
  'soft-rounded',
  'solid-rounded'
] as const

export function VariantsTabs() {
  return (
    <>
      {variants.map(variant => (
        <rh.div key={variant} my="10">
          <pre>variant = {variant}</pre>
          <TabsRoot variant={variant} mt="3" defaultValue="settings">
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
