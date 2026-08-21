import { useLoaderData } from 'react-router-dom'

import { Box } from '../../../box/box'
import { ListItem, ListRoot } from '../../../list/list'
import { getUsers } from '../api'
/* eslint-disable-next-line */
export interface UsersProps {}

export async function loader() {
  return getUsers()
}

export function Users(props: UsersProps) {
  const users = useLoaderData() as string[]
  return (
    <Box color="black">
      {users.map((user: any) => {
        return (
          <ListRoot as="ul" key={user._id}>
            <ListItem>Name: {user.name}</ListItem>
            <ListItem>Email: {user.email}</ListItem>
            <ListItem>Role: {user.role}</ListItem>
          </ListRoot>
        )
      })}
    </Box>
  )
}

export default Users
