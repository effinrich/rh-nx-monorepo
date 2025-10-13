import { useLoaderData } from 'react-router-dom'
import styled from '@emotion/styled'

import { ListItem, UnorderedList } from '../../../list/list'
import { getUsers } from '../api'
/* eslint-disable-next-line */
export interface UsersProps {}

const StyledOpCos = styled.div`
  color: black;
`

export async function loader() {
  return getUsers()
}

export function Users(props: UsersProps) {
  const users = useLoaderData() as string[]
  return (
    <StyledOpCos>
      {users.map((user: any) => {
        return (
          <UnorderedList key={user._id}>
            <ListItem>Name: {user.name}</ListItem>
            <ListItem>Email: {user.email}</ListItem>
            <ListItem>Role: {user.role}</ListItem>
          </UnorderedList>
        )
      })}
    </StyledOpCos>
  )
}

export default Users
