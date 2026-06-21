import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import {
  Box,
  Paper,
  Typography,
  Breadcrumbs,
  Link,
  Alert,
  Skeleton,
} from '@mui/material'
import { NavigateNext } from '@mui/icons-material'
import UserForm from '../components/UserForm'
import { usersApi } from '../api/users.api'
import type { CreateUserPayload } from '../types/user'

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { enqueueSnackbar } = useSnackbar()

  const { data: user, isLoading, isError, error } = useQuery({
    queryKey: ['users', id],
    queryFn: () => usersApi.getById(id!),
    enabled: !!id,
  })

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateUserPayload>) => usersApi.update(id!, data),
    onSuccess: () => {
      enqueueSnackbar('User updated successfully!', { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate('/users')
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: 'error' })
    },
  })

  if (isError) {
    return <Alert severity="error">{(error as Error).message}</Alert>
  }

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
        <Typography variant="body2" color="text.primary">Edit User</Typography>
      </Breadcrumbs>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Edit User</Typography>
          {user && (
            <Typography variant="body2" color="text.secondary">
              {user.firstName} {user.lastName} · {user.email}
            </Typography>
          )}
        </Box>
      </Box>

      <Paper sx={{ p: 4 }}>
        {isLoading ? (
          <Box>
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} height={56} sx={{ mb: 2 }} />
            ))}
          </Box>
        ) : user ? (
          <UserForm
            defaultValues={{
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              primaryMobile: user.primaryMobile,
              secondaryMobile: user.secondaryMobile ?? '',
              aadhaarNumber: user.aadhaarNumber,
              panNumber: user.panNumber,
              dateOfBirth: user.dateOfBirth.split('T')[0],
              placeOfBirth: user.placeOfBirth,
              currentAddress: user.currentAddress,
              permanentAddress: user.permanentAddress,
            }}
            onSubmit={updateMutation.mutateAsync}
            onCancel={() => navigate('/users')}
            isLoading={updateMutation.isPending}
            isEditMode
          />
        ) : null}
      </Paper>
    </Box>
  )
}
