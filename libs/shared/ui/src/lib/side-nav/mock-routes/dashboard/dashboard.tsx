import { Box } from '../../../box/box'
import { setOpCos, setUsers } from '../api'
/* eslint-disable-next-line */
export interface DashboardProps {}

export async function loader() {
  setOpCos()
  setUsers()
}

export function Dashboard(props: DashboardProps) {
  return (
    <Box color="black">
      <h1>Welcome to Dashboard!</h1>
    </Box>
  )
}

export default Dashboard
