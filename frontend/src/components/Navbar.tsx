import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material'
import { People, Add } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <AppBar position="static" elevation={0} sx={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
      <Toolbar>
        <People sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer' }}
          onClick={() => navigate('/users')}
        >
          User Management
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            startIcon={<People />}
            onClick={() => navigate('/users')}
            variant={location.pathname === '/users' ? 'outlined' : 'text'}
            sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
          >
            Users
          </Button>
          <Button
            color="inherit"
            startIcon={<Add />}
            onClick={() => navigate('/users/new')}
            variant="contained"
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' } }}
          >
            Add User
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
