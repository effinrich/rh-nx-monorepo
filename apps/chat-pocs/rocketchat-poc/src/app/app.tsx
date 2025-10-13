import { Route, Routes } from 'react-router-dom'

import { Chat } from '../views/chat/chat'
import { RequireAuth } from '../views/sign-in/require-auth/require-auth'
import { SignIn } from '../views/sign-in/sign-in'

export function App() {
  return (
    <Routes>
      <Route path="sign-in" element={<SignIn />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Chat />
          </RequireAuth>
        }
      />
    </Routes>
  )
}

export default App
