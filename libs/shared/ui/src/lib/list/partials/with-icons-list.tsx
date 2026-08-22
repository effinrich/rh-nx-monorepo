import { MdCheckCircle, MdSettings } from 'react-icons/md'

import { ListIndicator, ListItem, ListRoot } from '../list'

export function WithIconsList() {
  return (
    <ListRoot gap={3}>
      <ListItem>
        <ListIndicator asChild>
          <MdCheckCircle color="var(--chakra-colors-primary-500)" />
        </ListIndicator>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit
      </ListItem>
      <ListItem>
        <ListIndicator asChild>
          <MdCheckCircle color="var(--chakra-colors-primary-500)" />
        </ListIndicator>
        Assumenda, quia temporibus eveniet a libero incidunt suscipit
      </ListItem>
      <ListItem>
        <ListIndicator asChild>
          <MdCheckCircle color="var(--chakra-colors-primary-500)" />
        </ListIndicator>
        Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
      </ListItem>
      <ListItem>
        <ListIndicator asChild>
          <MdSettings color="var(--chakra-colors-primary-500)" />
        </ListIndicator>
        Quidem, ipsam illum quis sed voluptatum quae eum fugit earum
      </ListItem>
    </ListRoot>
  )
}
