import { Outlet } from 'react-router-dom'
import { Box } from '@redesignhealth/ui'

export const Layout = () => {
  return (
    <Box mt={24} mx="auto" maxW="950px">
      <Outlet />
    </Box>
  )
}

export default Layout
