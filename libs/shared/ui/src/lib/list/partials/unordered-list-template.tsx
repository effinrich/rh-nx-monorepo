import { ListItem, ListRoot } from '../list'

export function UnorderedListTemplate(args: Record<string, unknown>) {
  return (
    <ListRoot as="ul" {...args}>
      <ListItem>Lorem ipsum dolor sit amet</ListItem>
      <ListItem>Consectetur adipiscing elit</ListItem>
      <ListItem>Integer molestie lorem at massa</ListItem>
      <ListItem>Facilisis in pretium nisl aliquet</ListItem>
    </ListRoot>
  )
}
