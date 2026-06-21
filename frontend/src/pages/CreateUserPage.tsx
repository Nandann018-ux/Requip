import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { Box, Paper, Typography, Breadcrumbs, Link } from '@mui/material'
import { ChevronRight, PersonAddOutlined } from '@mui/icons-material'
import UserForm from '../components/UserForm'
import { usersApi } from '../api/users.api'
import type { CreateUserPayload } from '../types/user'

export default function CreateUserPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const createMutation = useMutation({
    mutationFn: (data: CreateUserPayload) => usersApi.create(data),
    onSuccess: () => {
      enqueueSnackbar('User created successfully', { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate('/users')
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: 'error' })
    },
  })

  return (
    <Box>
      {/* Breadcrumb */}
      <Breadcrumbs
        separator={<ChevronRight sx={{ fontSize: 14 }} />}
        sx={{ mb: 2.5, '& .MuiBreadcrumbs-separator': { color: '#C7C9D3' } }}
      >
        <Link
          component="button" variant="body2"
          onClick={() => navigate('/users')}
          underline="hover"
          sx={{ color: '#64748B', '&:hover': { color: '#4338CA' }, fontSize: '0.8125rem' }}
        >
          Users
        </Link>
        <Typography sx={{ fontSize: '0.8125rem', color: '#0F172A', fontWeight: 600 }}>
          New User
        </Typography>
      </Breadcrumbs>

      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <Box
          sx={{
            width: 38, height: 38, borderRadius: '10px',
            background: 'linear-gradient(135deg, #4338CA 0%, #6D63E8 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(67,56,202,0.3)',
            flexShrink: 0,
          }}
        >
          <PersonAddOutlined sx={{ fontSize: 18, color: '#fff' }} />
        </Box>
        <Box>
          <Typography variant="h4" sx={{ lineHeight: 1.1 }}>Create User</Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.25 }}>
            Add a new identity to the system
          </Typography>
        </Box>
      </Box>

      <Paper elevation={0}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <UserForm
            onSubmit={(data) => createMutation.mutateAsync(data).then(() => {})}
            onCancel={() => navigate('/users')}
            isLoading={createMutation.isPending}
          />
        </Box>
      </Paper>
    </Box>
  )
}
