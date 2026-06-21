import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { Box, Paper, Typography, Breadcrumbs, Link } from '@mui/material'
import { NavigateNext } from '@mui/icons-material'
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
      enqueueSnackbar('User created successfully!', { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate('/users')
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: 'error' })
    },
  })

  return (
    <Box>
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => navigate('/users')}
          underline="hover"
          color="inherit"
        >
          Users
        </Link>
        <Typography variant="body2" color="text.primary">New User</Typography>
      </Breadcrumbs>

      <Typography variant="h4" fontWeight={700} mb={3}>Create User</Typography>

      <Paper sx={{ p: 4 }}>
        <UserForm
          onSubmit={createMutation.mutateAsync}
          onCancel={() => navigate('/users')}
          isLoading={createMutation.isPending}
        />
      </Paper>
    </Box>
  )
}
