import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { theme } from '@chakra-ui/react'
import { AuthProvider } from '@redesignhealth/third-party-network/features/authentication'
import { RhProvider } from '@redesignhealth/ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import { Advisor } from './routes/advisor/advisor'
import { RootLayout } from './routes/layout/layout'
import { Login } from './routes/login/login'
import { Home } from './routes/root/root'

const router = (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path=":advisorId" element={<Advisor />} />
      </Route>
    </Routes>
  </BrowserRouter>
)

const queryClient = new QueryClient()
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools buttonPosition="bottom-right" />
      <RhProvider theme={theme}>
        <AuthProvider>{router}</AuthProvider>
      </RhProvider>
    </QueryClientProvider>
  </StrictMode>
)
