import { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Navbar from './components/Navbar'
import LoadingPage from './components/LoadingPage'
import UserListPage from './pages/UserListPage'
import CreateUserPage from './pages/CreateUserPage'
import EditUserPage from './pages/EditUserPage'

export default function App() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: `
          radial-gradient(ellipse 80% 50% at 50% -20%, rgba(67,56,202,0.055) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 85% 110%, rgba(99,102,241,0.04) 0%, transparent 50%)
        `,
      }}
    >
      <Navbar />
      <Box
        component="main"
        sx={{ flex: 1, maxWidth: 1320, width: '100%', mx: 'auto', px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, md: 4 } }}
        className="page-enter"
      >
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Navigate to="/users" replace />} />
            <Route path="/users" element={<UserListPage />} />
            <Route path="/users/new" element={<CreateUserPage />} />
            <Route path="/users/:id/edit" element={<EditUserPage />} />
          </Routes>
        </Suspense>
      </Box>
    </Box>
  )
}
