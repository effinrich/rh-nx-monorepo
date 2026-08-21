import { useLoaderData } from 'react-router-dom'

import { Box } from '../../../box/box'
import { ListItem, ListRoot } from '../../../list/list'
import { getOpCos } from '../api'
/* eslint-disable-next-line */
export interface OpCosProps {}

export async function loader() {
  return getOpCos()
}

export function OpCos(props: OpCosProps) {
  const opCos = useLoaderData() as string[]
  return (
    <Box color="black">
      {opCos.map((opCo: any) => {
        return (
          <ListRoot as="ul" key={opCo._id}>
            <ListItem>Internal op-co name: {opCo.internalOpCoName}</ListItem>
            <ListItem>Setup status: {opCo.setupStatus}</ListItem>
            <ListItem># of users: {opCo.numberOfUsers}</ListItem>
          </ListRoot>
        )
      })}
    </Box>
  )
}

export default OpCos
