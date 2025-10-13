import styled from '@emotion/styled'

import { setOpCos, setUsers } from '../api'
/* eslint-disable-next-line */
export interface DashboardProps {}

const StyledOpCos = styled.div`
  color: black;
`

export async function loader() {
  setOpCos()
  setUsers()
}

export function Dashboard(props: DashboardProps) {
  return (
    <StyledOpCos>
      <h1>Welcome to Dashboard!</h1>
    </StyledOpCos>
  )
}

export default Dashboard
