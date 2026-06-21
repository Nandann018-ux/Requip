import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const onUsers = location.pathname === '/users'

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: 'blur(12px)',
        backgroundColor: 'rgba(255,255,255,0.88)',
        borderBottom: '1px solid rgba(232,233,240,0.8)',
        boxShadow: '0 1px 0 rgba(15,23,42,0.04)',
        color: '#0F172A',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4 }, minHeight: '56px !important', gap: 2 }}>
        {/* Brand */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', mr: 3, flexShrink: 0 }}
          onClick={() => navigate('/users')}
        >
          {/* Shield mark */}
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: '7px',
              background: 'linear-gradient(140deg, #4338CA 0%, #6D63E8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(67,56,202,0.4)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </Box>
          <Typography
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 800,
              fontSize: '0.9375rem',
              letterSpacing: '-0.025em',
              color: '#0F172A',
              lineHeight: 1,
            }}
          >
            UserVault
          </Typography>
          <Chip
            label="v1"
            size="small"
            sx={{
              height: 16,
              fontSize: '0.6rem',
              fontWeight: 700,
              bgcolor: '#EEF2FF',
              color: '#4338CA',
              border: '1px solid #C7D2FE',
              borderRadius: '3px',
              ml: -0.5,
              '& .MuiChip-label': { px: 0.75 },
            }}
          />
        </Box>

        {/* Divider */}
        <Box sx={{ width: '1px', height: 20, bgcolor: '#E8E9F0', flexShrink: 0 }} />

        {/* Nav links */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flex: 1 }}>
          <Button
            onClick={() => navigate('/users')}
            disableRipple
            size="small"
            sx={{
              fontSize: '0.8375rem',
              fontWeight: onUsers ? 600 : 500,
              color: onUsers ? '#4338CA' : '#64748B',
              bgcolor: onUsers ? '#EEF2FF' : 'transparent',
              px: 1.25,
              py: 0.625,
              borderRadius: '6px',
              minWidth: 0,
              transition: 'all 0.15s ease',
              '&:hover': { bgcolor: onUsers ? '#E0E7FF' : '#F4F4F6', color: onUsers ? '#3730A3' : '#374151' },
            }}
          >
            Directory
          </Button>
        </Box>

        {/* Status dot */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mr: 1.5, opacity: 0.7 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#10B981', boxShadow: '0 0 0 2px rgba(16,185,129,0.2)' }} />
          <Typography sx={{ fontSize: '0.72rem', fontFamily: '"JetBrains Mono", monospace', color: '#6B7180', fontWeight: 500 }}>
            live
          </Typography>
        </Box>

        {/* CTA */}
        <Button
          onClick={() => navigate('/users/new')}
          variant="contained"
          size="small"
          startIcon={<Add sx={{ fontSize: '15px !important' }} />}
          sx={{ px: 1.75, py: 0.75, fontSize: '0.8125rem' }}
        >
          New User
        </Button>
      </Toolbar>
    </AppBar>
  )
}
