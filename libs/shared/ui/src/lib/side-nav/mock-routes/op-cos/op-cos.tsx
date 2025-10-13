import { useLoaderData } from 'react-router-dom'
import styled from '@emotion/styled'

import { ListItem, UnorderedList } from '../../../list/list'
import { getOpCos } from '../api'
/* eslint-disable-next-line */
export interface OpCosProps {}

const StyledOpCos = styled.div`
  color: black;
`

export async function loader() {
  return getOpCos()
}

export function OpCos(props: OpCosProps) {
  const opCos = useLoaderData() as string[]
  return (
    <StyledOpCos>
      {opCos.map((opCo: any) => {
        return (
          <UnorderedList key={opCo._id}>
            <ListItem>Internal op-co name: {opCo.internalOpCoName}</ListItem>
            <ListItem>Setup status: {opCo.setupStatus}</ListItem>
            <ListItem># of users: {opCo.numberOfUsers}</ListItem>
          </UnorderedList>
        )
      })}
    </StyledOpCos>
  )
}

export default OpCos
