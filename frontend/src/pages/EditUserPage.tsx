import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import {
  Box, Paper, Typography, Breadcrumbs, Link, Alert, Skeleton, Avatar,
} from '@mui/material'
import { ChevronRight, EditOutlined } from '@mui/icons-material'
import UserForm from '../components/UserForm'
import { usersApi } from '../api/users.api'
import type { CreateUserPayload } from '../types/user'

const AVATAR_COLORS = [
  ['#4338CA', '#EEF2FF'], ['#059669', '#ECFDF5'],
  ['#D97706', '#FEF3C7'], ['#DC2626', '#FEF2F2'],
  ['#7C3AED', '#F5F3FF'], ['#0891B2', '#E0F2FE'],
]

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
      enqueueSnackbar('User updated successfully', { variant: 'success' })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      navigate('/users')
    },
    onError: (err: Error) => {
      enqueueSnackbar(err.message, { variant: 'error' })
    },
  })

  if (isError) {
    return <Alert severity="error" sx={{ mt: 2 }}>{(error as Error).message}</Alert>
  }

  const fullName = user ? `${user.firstName} ${user.lastName}` : ''
  const [fg, bg] = AVATAR_COLORS[(fullName.charCodeAt(0) || 0) % AVATAR_COLORS.length]

  return (
    <Box>
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
          {isLoading ? 'Edit User' : `Edit ${user?.firstName}`}
        </Typography>
      </Breadcrumbs>

      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        {isLoading ? (
          <Skeleton variant="circular" width={38} height={38} />
        ) : (
          <Avatar
            sx={{
              width: 38, height: 38, bgcolor: bg, color: fg,
              fontSize: '0.9rem', fontWeight: 700,
              fontFamily: '"Outfit", sans-serif',
              border: `2px solid ${fg}30`,
              flexShrink: 0,
            }}
          >
            {fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </Avatar>
        )}
        <Box>
          {isLoading ? (
            <>
              <Skeleton width={180} height={28} />
              <Skeleton width={120} height={16} />
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="h4" sx={{ lineHeight: 1.1 }}>{fullName}</Typography>
                <EditOutlined sx={{ fontSize: 16, color: '#9499B0', mt: 0.25 }} />
              </Box>
              <Typography variant="body2" sx={{ color: '#64748B', mt: 0.25 }}>
                {user?.email} · ID: <span style={{ fontFamily: '"JetBrains Mono", monospace', fontSize: '0.75rem' }}>{id?.slice(0, 8)}…</span>
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Paper elevation={0}>
        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          {isLoading ? (
            <Box>
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} variant="rounded" height={44} sx={{ mb: 2, borderRadius: '8px' }} />
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
              onSubmit={(data) => updateMutation.mutateAsync(data).then(() => {})}
              onCancel={() => navigate('/users')}
              isLoading={updateMutation.isPending}
              isEditMode
            />
          ) : null}
        </Box>
      </Paper>
    </Box>
  )
}
